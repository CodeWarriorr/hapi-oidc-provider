import { interactionPolicy } from 'oidc-provider';
const { Check, Prompt } = interactionPolicy;

const NO_NEED_TO_PROMPT = false;
const REQUEST_PROMPT = true;

// INFO: test policy
export default [
  new Prompt(
    { name: 'phone', requestable: true },

    new Check(
      'no_phone_number',
      'End-User phone number is required',
      'no_phone_number',
      async ctx => {
        const { oidc } = ctx;

        console.log('NO no_phone_number CHECK !', oidc, oidc.result);

        if (oidc.result?.phone_number) {
          return NO_NEED_TO_PROMPT;
        }

        return REQUEST_PROMPT;
      },
      async ctx => {
        const { oidc } = ctx;
        return {
          result: oidc.result,
          session: oidc.session,
          params: oidc.params,
          prompts: oidc.prompts,
        };
      }
    )
  ),

  new Prompt(
    { name: 'code', requestable: false },

    new Check(
      'no_code',
      'code_has_to_be_provided',
      'code_has_to_be_provided',
      async ctx => {

        const { oidc } = ctx;


        if (oidc.result?.code) {
          return NO_NEED_TO_PROMPT;
        }

        return REQUEST_PROMPT;
      },
      async ctx => {
        const { oidc } = ctx;
        return {
          result: oidc.result,
          session: oidc.session,
          params: oidc.params,
          prompts: oidc.prompts,
        };
      }
    )
  ),

  new Prompt(
    { name: 'consent', requestable: true },

    new Check('native_client_prompt', 'native clients require End-User interaction', 'interaction_required', ctx => {
      const { oidc } = ctx;

      if (!oidc || !oidc.client || !oidc.params) {
        throw new Error('nasty error');
      }

      if (
        oidc.client.applicationType === 'native' &&
        oidc.params.response_type !== 'none' &&
        (!oidc.result || !('consent' in oidc.result))
      ) {
        return REQUEST_PROMPT;
      }

      return NO_NEED_TO_PROMPT;
    })
  ),
];
