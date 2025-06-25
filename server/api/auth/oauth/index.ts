import { Provider } from "@supabase/supabase-js";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { provider } = await readBody(event);

  if (!provider) {
    throw createError({
      statusCode: 400,
      message: "Provider is required",
    });
  }

  const client = await serverSupabaseClient(event);

  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        queryParams: {
          redirect_to: "/dashboard/settings",
        },
      },
    });

    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }

    return { url: data.url };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
