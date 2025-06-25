import type { Session, User } from "@supabase/supabase-js";
import type { SignInBody } from "@/modules/saas/auth/types";
import { useToast } from "@/modules/ui/components/toast/use-toast";
import api from "@/config/api";
import type { UserSubscription } from "@/modules/shared/types/database.types";

export const useUser = ({ initialUser }: { initialUser?: User } = {}) => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const subscription = ref<any>(null);

  const loaded = useState("useUser-loaded", () => !!initialUser);
  const user = useState<User | null>("useUser-user", () => initialUser ?? null);
  const userPlan = useState<UserSubscription | null>(
    "useUser-user-plan",
    () => null
  );

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    user.value = data?.user || null;
    loaded.value = true;
    return data?.user || null;
  };

  const setupAuthListener = async () => {
    const {
      data: { subscription: sub },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const prevUser = user.value;

      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
          user.value = session?.user || null;
          if (user.value?.id !== prevUser?.id) {
            userPlan.value = await loadPlan();
          }
          break;
        case "SIGNED_OUT":
          user.value = null;
          userPlan.value = null;
          break;
        default:
          return;
      }

      loaded.value = true;
    });

    subscription.value = sub;
    return () => {
      if (subscription.value) {
        subscription.value.unsubscribe();
      }
    };
  };

  // 发送手机验证码
  const sendPhoneCode = async (phone: string) => {
    const { data } = await $fetch<{ data: any }>(api.sendPhoneCode, {
      method: "POST",
      body: { phone },
    });

    toast({
      title: "验证码已发送",
      duration: 2000,
    });

    return data;
  };

  // 登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    loaded.value = false;

    navigateTo("/");
  };

  // 获取当前用户
  const getCurrentUser = async () => {
    const {
      data: { user: currentUser },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    user.value = currentUser;
    loaded.value = true;
    return currentUser;
  };

  // 登录方法
  const signIn = async (params: SignInBody) => {
    const res = await $fetch<{ user: User; session: Session }>(api.signin, {
      method: "POST",
      body: params,
    });

    if (res.user && res.session) {
      // 更新 Supabase Cookie
      await supabase.auth.setSession({
        access_token: res.session.access_token,
        refresh_token: res.session.refresh_token,
      });

      user.value = res.user;
      loaded.value = true;

      navigateTo("/dashboard");
      toast({
        title: "登录成功",
        duration: 2000,
      });
    }
  };

  // 注册方法
  const signUp = async (params: SignInBody) => {
    const res = await $fetch<{ user: User; session: Session }>(api.signup, {
      method: "POST",
      body: params,
    });

    if (res.user) {
      if (params.type === "email") {
        // 邮箱注册
        toast({
          title: "注册邮件已发送，请查收",
          duration: 2000,
        });
      } else if (params.type === "phone") {
        // 手机号注册成功后直接登录
        user.value = res.user;
        loaded.value = true;

        // 导航到仪表板
        navigateTo("/dashboard");
        toast({
          title: "注册成功，已为您自动登录",
          duration: 2000,
        });
      }
    }
  };

  // 获取用户订阅计划
  const loadPlan = async () => {
    if (!user.value?.id) return null;

    const res = await $fetch<UserSubscription>(api.subscription, {
      method: "GET",
    });

    return res;
  };

  return {
    loaded,
    loadUser,
    user,
    userPlan,
    loadPlan,
    sendPhoneCode,
    signOut,
    getCurrentUser,
    signIn,
    signUp,
    setupAuthListener,
  };
};
