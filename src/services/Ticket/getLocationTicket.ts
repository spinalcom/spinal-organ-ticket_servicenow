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
import { findOneAsyncPredicate } from '../../utils/findOneNodeUtils';
import { getGeoBuiding } from './getGeoBuiding';
import { getNodeAlias } from './getNodeAlias';
import { getGeoContext } from './getGeoContext';
import {
  GEO_FIND_ROOM_BY_CONTEXT,
} from '../../constants';

export async function getLocationTicket(
  roomName: string,
  graph: SpinalGraph<any>,
  spatialContextId: string
): Promise<SpinalNode<any>> {
  // get building
  const context = await getGeoContext(graph, spatialContextId);
  if (context) {
    const res = await findOneAsyncPredicate(
      context,
      GEO_FIND_ROOM_BY_CONTEXT,
      async (node: SpinalNode<any>): Promise<boolean> => {
        const attr = await getNodeAlias(node, 'alias_servicenow');
        return attr && attr.value.get() === roomName;
      }
    );
    if (res) {
      // @ts-ignore
      SpinalGraphService._addNode(res);
      return res;
    }
    return getGeoBuiding(graph, spatialContextId);
  }
}
