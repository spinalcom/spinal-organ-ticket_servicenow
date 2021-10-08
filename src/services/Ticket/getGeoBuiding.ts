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
import { GEO_BUILDING_TYPE, GEO_FIND_BUILDING } from '../../constants';
import { findOne } from '../../utils/findOneNodeUtils';
import { getGeoContext } from './getGeoContext';

export async function getGeoBuiding(
  graph: SpinalGraph<any>,
  spatialContextId: string
): Promise<SpinalNode<any>> {
  const context = await getGeoContext(graph, spatialContextId);
  if (context) {
    const res = await findOne(
      context,
      GEO_FIND_BUILDING,
      (node: SpinalNode<any>): boolean =>
        node.getType()?.get() === GEO_BUILDING_TYPE
    );
    if (res) {
      // @ts-ignore
      SpinalGraphService._addNode(res);
      return res;
    }
  }
}

// [
//   GEO_CONTEXT_TYPE,
//   GEO_SITE_TYPE,
//   GEO_BUILDING_TYPE,
//   GEO_FLOOR_TYPE,
//   GEO_ZONE_TYPE,
//   GEO_ROOM_TYPE,
// ];
