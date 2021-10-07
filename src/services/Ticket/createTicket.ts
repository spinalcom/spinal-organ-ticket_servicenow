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

import {
  SpinalContext,
  SpinalGraph,
  SpinalGraphService,
} from 'spinal-env-viewer-graph-service';
import { spinalServiceTicket } from 'spinal-service-ticket';
import { stringToTimestamp } from '../../utils/DateString';
import { getStepOrderByApiName } from '../../utils/stepMatching';
import type { IResultItem } from '../ServiceNow/GetTableDI';
import { getDomaine } from './getDomaine';
import { getLocationTicket } from './getLocationTicket';
import { updateStep } from './updateStep';
import { updateTicketInfo } from './updateTicketInfo';

export async function createTicket(
  DI: IResultItem,
  contextTicket: SpinalContext<any>,
  contextGeoId: string,
  graph: SpinalGraph<any>
): Promise<void> {
  console.group('createTicket');
  console.debug('createTicket');
  const locationNode = await getLocationTicket(DI, graph, contextGeoId);
  const domaine = await getDomaine(contextTicket, DI.category);

  const ticketInfo = {
    name: DI.short_description,
    user: { userid: 0, name: DI.sys_created_by },
    gmaoId: DI.sys_id,
    priority: DI.priority,
    description: DI.description,
    // 27/05/2021 15:31
    gmaoDateCreation: stringToTimestamp(DI.opened_at, 'YYYY-MM-DD HH:mm:ss ZZ'),
    subcategory: DI.subcategory,
    state: DI.state,
    process: DI.category,
    room: DI.u_room,
  };
  console.debug(ticketInfo);
  const ticketId = await spinalServiceTicket.addTicket(
    ticketInfo,
    domaine.info.id.get(),
    contextTicket.info.id.get(),
    locationNode.info.id.get()
  );
  if (typeof ticketId !== 'string')
    return console.error('addTicket did not return a string', ticketId);
  // check if step if default
  const ticketNode = SpinalGraphService.getRealNode(ticketId);
  updateTicketInfo(DI, ticketNode);
  if (getStepOrderByApiName(DI.state) !== 0) {
    await updateStep(ticketNode, DI, contextTicket, domaine);
  }
  console.groupEnd();
}
