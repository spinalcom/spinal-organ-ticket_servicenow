/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import moment = require('moment');
import type {
  SpinalContext,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import type OrganConfigModel from '../../model/OrganConfigModel';
import {
  GetTableDI,
  IApiGETTableRes,
  IResultItem,
} from '../../services/ServiceNow/GetTableDI';
import { createTicket } from '../../services/Ticket/createTicket';
import { findTicketInContext } from '../../services/Ticket/findTicketInContext';
import { getContextTicket } from '../../services/Ticket/getContextTicket';
import { initContext } from '../../services/Ticket/initContext';
import { updateTicket } from '../../services/Ticket/updateTicket';
import { stringToTimestamp } from '../../utils/DateString';
import { waitFct } from '../../utils/waitFct';
import type IStatus from './IStatus';

export default class SyncRun implements IStatus {
  graph: SpinalGraph<any>;
  config: OrganConfigModel;
  running: boolean = false;

  constructor(graph: SpinalGraph<any>, config: OrganConfigModel) {
    this.graph = graph;
    this.config = config;
  }

  async updateContext(DIs: IApiGETTableRes): Promise<void> {
    const context = await getContextTicket(
      this.graph,
      this.config.contextId.get()
    );

    for (const DI of DIs.result) {
      const ticketInfo: ITicketInfo = {
        name: DI.short_description || DI.number,
        user: { userid: 0, name: DI.sys_created_by },
        gmaoId: DI.sys_id,
        priority: DI.priority,
        description: DI.description,
        gmaoDateCreation: stringToTimestamp(
          DI.opened_at,
          'YYYY-MM-DD HH:mm:ss ZZ'
        ),
        subcategory: DI.subcategory,
        state: DI.state,
        process: DI.category,
        room: DI.u_room,
      };

      await this.createOrUpdateTicket(ticketInfo, context);
    }
  }

  async createOrUpdateTicket(
    DI: ITicketInfo,
    contextTicket: SpinalContext<any>
  ): Promise<void> {
    // search ticket in context
    console.log(moment().format(), 'createOrUpdateTicket');
    console.log(DI);

    const ticketNode = await findTicketInContext(DI.gmaoId, contextTicket);
    if (ticketNode) {
      // found ticket
      return updateTicket(DI, contextTicket, ticketNode);
    }
    return createTicket(
      DI,
      contextTicket,
      this.config.spatialContextID.get(),
      this.graph
    );
  }

  async init(): Promise<void> {
    await initContext(this.graph, this.config.contextId.get());
    try {
      const DIs = await GetTableDI(
        this.config.gmaoSpec.apiLogin.get(),
        this.config.gmaoSpec.apiPassword.get()
      );
      await this.updateContext(DIs);
      this.config.gmaoSpec.lastSync.set(Date.now());
    } catch (e) {
      console.error(e);
    }
  }
  checkConfig(): void {
    if (
      !(
        this.config.gmaoSpec.apiLogin.get() &&
        this.config.gmaoSpec.apiPassword.get()
      )
    )
      throw new Error('Config api login / password not set');
  }
  async start(): Promise<number> {
    console.log('start SyncRun');
    this.checkConfig();
    this.running = true;
    await this.init();
    const timeout = this.config.gmaoSpec.pullInterval.get();
    await waitFct(timeout);
    while (true) {
      if (!this.running) break;
      console.group('SyncRun loop');
      const before = Date.now();
      try {
        const DIs = await GetTableDI(
          this.config.gmaoSpec.apiLogin.get(),
          this.config.gmaoSpec.apiPassword.get()
        );
        await this.updateContext(DIs);
        this.config.gmaoSpec.lastSync.set(Date.now());
      } catch (e) {
        console.error(e);
        await waitFct(1000 * 60);
      } finally {
        const delta = Date.now() - before;
        const timeout = this.config.gmaoSpec.pullInterval.get() - delta;
        await waitFct(timeout);
        console.groupEnd();
      }
    }
    return 0;
  }

  stop() {
    this.running = false;
    console.log('stop SyncRun');
  }
}
