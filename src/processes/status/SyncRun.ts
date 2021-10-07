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
      await this.createOrUpdateTicket(DI, context);
    }
  }

  async createOrUpdateTicket(
    DI: IResultItem,
    contextTicket: SpinalContext<any>
  ): Promise<void> {
    // search ticket in context
    console.debug(
      moment().format(),
      'createOrUpdateTicket',
      DI.sys_id,
      DI.short_description
    );
    const ticketNode = await findTicketInContext(DI.sys_id, contextTicket);
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
      console.log('start SyncRun loop');
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
      }
    }
    return 0;
  }

  stop() {
    this.running = false;
    console.log('stop SyncRun');
  }
}
