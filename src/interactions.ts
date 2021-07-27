import { Request } from '@hapi/hapi';
import oidcProvider from './assembly/oidcProvider';

export const controller = {
  interactionDetails: async ({ raw: { req, res } }: Request) => {
    return oidcProvider.interactionDetails(req, res);
  },
  interactionPhone: async ({ raw: { req, res }, payload }: Request) => {
    const interactionDetails = await oidcProvider.interactionDetails(req, res);
    console.log(interactionDetails);

    const result = {
      phone_number: (<any>payload).phone,
    };

    const returnTo = oidcProvider.interactionResult(req, res, result, { mergeWithLastSubmission: true });

    return { returnTo };
  },
  interactionCode: async ({ raw: { req, res }, payload }: Request) => {
    const interactionDetails = await oidcProvider.interactionDetails(req, res);
    console.log(interactionDetails);

    const result = {
      code: (<any>payload).code,
    };

    const returnTo = oidcProvider.interactionResult(req, res, result, { mergeWithLastSubmission: true });

    return { returnTo };
  },
};

export const api = [
  {
    method: 'GET',
    path: '/auth/interactions/{uid}',
    handler: controller.interactionDetails,
  },
  {
    method: 'GET',
    path: '/auth/interactions/{uid}/details',
    handler: controller.interactionDetails,
  },
  {
    method: 'POST',
    path: '/auth/interactions/{uid}/phone',
    handler: controller.interactionPhone,
  },
  {
    method: 'POST',
    path: '/auth/interactions/{uid}/code',
    handler: controller.interactionCode,
  },
];
