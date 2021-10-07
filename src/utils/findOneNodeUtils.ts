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

import type {
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { consumeBatch } from './consumeBatch';

export async function findOneInContext(
  node: SpinalNode<any>,
  context: SpinalContext<any>,
  predicate: (node: SpinalNode<any>) => boolean
): Promise<SpinalNode<any>> {
  const seen: Set<SpinalNode<any>> = new Set([node]);
  let promises: (() => Promise<SpinalNode<any>[]>)[] = [];
  let nextGen: SpinalNode<any>[] = [node];
  let currentGen: SpinalNode<any>[] = [];

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const currNode of currentGen) {
      if (predicate(currNode)) {
        return currNode;
      }
      promises.push(() => currNode.getChildrenInContext(context));
    }

    const childrenArrays = await consumeBatch(promises);
    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
}

export async function findOne(
  node: SpinalNode<any>,
  relations: string[],
  predicate: (node: SpinalNode<any>) => boolean
): Promise<SpinalNode<any>> {
  const seen: Set<SpinalNode<any>> = new Set([node]);
  let promises: (() => Promise<SpinalNode<any>[]>)[] = [];
  let nextGen: SpinalNode<any>[] = [node];
  let currentGen: SpinalNode<any>[] = [];

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const currNode of currentGen) {
      if (predicate(currNode)) {
        return currNode;
      }
      promises.push(() => currNode.getChildren(relations));
    }

    const childrenArrays = await consumeBatch(promises);
    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
}

export async function findOneInContextAsyncPredicate(
  node: SpinalNode<any>,
  context: SpinalContext<any>,
  predicate: (node: SpinalNode<any>) => Promise<boolean>
): Promise<SpinalNode<any>> {
  const seen: Set<SpinalNode<any>> = new Set([node]);
  let promises: (() => Promise<SpinalNode<any>[]>)[] = [];
  let nextGen: SpinalNode<any>[] = [node];
  let currentGen: SpinalNode<any>[] = [];
  let found: SpinalNode<any> = null;
  if (await predicate(node)) {
    return node;
  }

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const cuurNode of currentGen) {
      promises.push(async () => {
        if (found) return [];
        const arr = await cuurNode.getChildrenInContext(context);
        const resProm = [];
        for (const child of arr) {
          resProm.push(async (): Promise<void> => {
            if (found) return;
            const res = await predicate(child);
            if (res) found = child;
          });
        }
        await consumeBatch(resProm);
        return arr;
      });
    }
    const childrenArrays = await consumeBatch(promises);
    if (found) return found;
    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
  return found;
}

export async function findOneAsyncPredicate(
  node: SpinalNode<any>,
  relations: string[],
  predicate: (node: SpinalNode<any>) => Promise<boolean>
): Promise<SpinalNode<any>> {
  const seen: Set<SpinalNode<any>> = new Set([node]);
  let promises: (() => Promise<SpinalNode<any>[]>)[] = [];
  let nextGen: SpinalNode<any>[] = [node];
  let currentGen: SpinalNode<any>[] = [];
  let found: SpinalNode<any> = null;
  if (await predicate(node)) {
    return node;
  }

  while (nextGen.length) {
    currentGen = nextGen;
    promises = [];
    nextGen = [];

    for (const cuurNode of currentGen) {
      promises.push(async () => {
        if (found) return [];
        const arr = await cuurNode.getChildren(relations);
        const resProm = [];
        for (const child of arr) {
          resProm.push(async (): Promise<void> => {
            if (found) return;
            const res = await predicate(child);
            if (res) found = child;
          });
        }
        await consumeBatch(resProm);
        return arr;
      });
    }
    const childrenArrays = await consumeBatch(promises);
    if (found) return found;
    for (const children of childrenArrays) {
      for (const child of children) {
        if (!seen.has(child)) {
          nextGen.push(child);
          seen.add(child);
        }
      }
    }
  }
  return found;
}
