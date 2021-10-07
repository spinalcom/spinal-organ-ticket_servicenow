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

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { SPINAL_TICKET_SERVICE_STEP_RELATION_NAME } from '../../constants';

export async function getProcessByStepId(stepId: string) {
  const stepNode = SpinalGraphService.getRealNode(stepId);
  const parents = await stepNode.getParents(
    SPINAL_TICKET_SERVICE_STEP_RELATION_NAME
  );
  return parents[0];
}
