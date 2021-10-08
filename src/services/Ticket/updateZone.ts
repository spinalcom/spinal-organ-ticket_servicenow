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
  SpinalGraph,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  GEO_BUILDING_TYPE,
  GEO_EQUIPMENT_TYPE,
  GEO_FLOOR_TYPE,
  GEO_REFERENCE_TYPE,
  GEO_ROOM_TYPE,
  GEO_SITE_TYPE,
  GEO_ZONE_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
} from '../../constants';
import { consumeBatch } from '../../utils/consumeBatch';
import { SpinalNodeGetParent } from '../../utils/SpinalNodeGetParent';
import { getLocationTicket } from './getLocationTicket';

const VALID_GEO_TYPE = [
  GEO_SITE_TYPE,
  GEO_BUILDING_TYPE,
  GEO_FLOOR_TYPE,
  GEO_ZONE_TYPE,
  GEO_ROOM_TYPE,
  GEO_EQUIPMENT_TYPE,
  GEO_REFERENCE_TYPE,
];

async function getTicketZone(
  ticketNode: SpinalNode<any>
): Promise<SpinalNode<any>[]> {
  const parents = await SpinalNodeGetParent(
    ticketNode,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME
  );

  return parents.reduce((acc, parent) => {
    if (VALID_GEO_TYPE.includes(parent.getType().get())) {
      (<any>SpinalGraphService)._addNode(parent);
      acc.push(parent);
    }
    return acc;
  }, []);
}
export async function updateZone(
  DI: ITicketInfo,
  ticketNode: SpinalNode<any>,
  contextGeoId: string,
  graph: SpinalGraph<any>
) {
  const parents = await getTicketZone(ticketNode);
  const locationNode = await getLocationTicket(DI.room, graph, contextGeoId);
  const prom = [];
  let found = false;
  for (const parent of parents) {
    if (locationNode === parent) {
      found = true;
    } else {
      prom.push(
        (): Promise<void> =>
          parent.removeChild(
            ticketNode,
            SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
            'PtrLst'
          )
      );
    }
  }
  if (!found) {
    prom.push(
      (): Promise<void> =>
        locationNode
          .addChild(
            ticketNode,
            SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
            'PtrLst'
          )
          .then(() => undefined)
    );
  }
  return consumeBatch(prom);
}
