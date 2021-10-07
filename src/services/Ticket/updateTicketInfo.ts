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

import type { SpinalNode } from 'spinal-env-viewer-graph-service';
import type { IResultItem } from '../ServiceNow/GetTableDI';
import { stringToTimestamp } from '../../utils/DateString';
import { createIfNotExist, setOrAddAttr } from '../../utils/setOrAddAttr';

export function updateTicketInfo(
  ticket: IResultItem,
  ticketNode: SpinalNode<any>
): void {
  setOrAddAttr(ticketNode.info, 'name', ticket.short_description);
  createIfNotExist(ticketNode.info, 'user', {
    userid: 0,
    name: ticket.sys_created_by,
  });
  setOrAddAttr(ticketNode.info, 'gmaoId', ticket.sys_id);
  setOrAddAttr(ticketNode.info, 'priority', ticket.priority);
  setOrAddAttr(ticketNode.info, 'description', ticket.description);
  setOrAddAttr(
    ticketNode.info,
    'gmaoDateCreation',
    stringToTimestamp(ticket.opened_at, 'YYYY-MM-DD HH:mm:ss ZZ')
  );
  setOrAddAttr(ticketNode.info, 'subcategory', ticket.subcategory);
  setOrAddAttr(ticketNode.info, 'state', ticket.state);
  setOrAddAttr(ticketNode.info, 'u_room', ticket.u_room);
}
