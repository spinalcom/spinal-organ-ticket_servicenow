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
interface IStep {
  api: string | number;
  label: string;
  order: number;
}

function addStep(api: string | number, label: string, order: number): IStep {
  return {
    api,
    label,
    order,
  };
}

// Draft : 1
// Submitted : 5
// Ready : 10
// Assigned : 16
// "Work in progress" : 18
// Resolved : 6
// Complete: 3

const data = [
  addStep(1, 'Draft ', 0),
  addStep(5, 'Submitted ', 1),
  addStep(10, 'Ready ', 2),
  addStep(16, 'Assigned ', 3),
  addStep(18, 'Work in progress', 4),
  addStep(6, 'Resolved ', 5),
  addStep(3, 'Complete', 6),
];

export function getStepNameByApiName(apiStepName: string | number) {
  for (const obj of data) {
    if (obj.api === apiStepName) return obj.label;
  }
}
export function getStepNameByLabelName(labelStepName: string) {
  for (const obj of data) {
    if (obj.label === labelStepName) return obj.api;
  }
}

export function getStepOrderByApiName(apiName: string | number) {
  for (const obj of data) {
    if (obj.api === apiName) return obj.order;
  }
}
