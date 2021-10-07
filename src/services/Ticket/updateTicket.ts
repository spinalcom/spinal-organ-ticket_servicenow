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

import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IResultItem } from '../ServiceNow/GetTableDI';
import { updateProcess } from './updateProcess';
import { updateStep } from './updateStep';
import { updateTicketInfo } from './updateTicketInfo';

export async function updateTicket(
  DI: IResultItem,
  contextTicket: SpinalContext<any>,
  ticketNode: SpinalNode<any>
) {
  console.group('updateTicket');
  console.debug('updateTicket');
  const process = await updateProcess(ticketNode, DI.category, contextTicket);
  if (!process) return console.error('Domaine Not found');
  await updateStep(ticketNode, DI, contextTicket, process);
  updateTicketInfo(DI, ticketNode);
  console.groupEnd();
}
