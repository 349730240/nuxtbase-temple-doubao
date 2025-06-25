<!-- AI应用：emoji添加 -->
<template>
  <div>
    <!-- 输入框 -->
    <div class="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
      <div>
        <Textarea
          id="text"
          name="text"
          rows="10"
          v-model="text"
          placeholder="输入文本内容，AI自动帮你添加合适的Emoji表情"
        />
      </div>
      <div class="border border-dashed border-gray-300 rounded-md relative">
        <div
          v-if="loading"
          class="absolute w-full h-full bg-white z-10 flex items-center justify-center"
        >
          <img
            class="max-w-32"
            src="https://static-redbook.aiyeshi.cn/web-static/cube-loading.png"
          />
        </div>
        <Textarea
          id="text"
          name="text"
          rows="10"
          disabled
          v-model="emojiText"
          class="h-full text-foreground !opacity-100 !cursor-auto"
        />
        <div
          v-if="!emojiText"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <img
            class="w-48"
            src="https://static-main.aiyeshi.cn/nuxtbase/images/common/emoji-bg.png"
          />
          <div class="font-semibold text-center">AI文案 🎉</div>
        </div>
      </div>
    </div>
    <!-- 配置 -->
    <div class="flex justify-between mt-4">
      <div class="flex items-center text-sm gap-4">
        Emoji数量：
        <RadioGroup v-model="type" class="flex gap-4">
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="less" id="less" />
            <Label for="less">较少</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem value="more" id="more" />
            <Label for="more">较多</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Button
          :class="{
            'cursor-wait': loading,
          }"
          :disabled="loading"
          @click="onHandleEmoji"
        >
          <LucideLoaderCircle
            v-if="loading"
            class="mr-2 h-4 w-4 animate-spin"
          />
          添加Emoji
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "@/modules/ui/components/toast/use-toast";
import { useUserTokenStore } from "@/stores/user-token";

const tokenStore = useUserTokenStore();

const { toast } = useToast();

// 原始文案
const text = ref(
  `青青草地绿水青山，湖光山色波光粼粼，桨板像一块会飞的魔毯，在湖面自由穿梭。瞧！小狗子们多勇敢，或驻立板头神情自若，或伴着微风轻拂小憩一会，亦有小健将们干脆跳进水里游个痛快。让我们荡起双桨，划入夏天，享受当下，莫负时光`
);
// 添加了emoji后的文案
const emojiText = ref();
// 文案数量
const type = ref("less");
// 是否正在加载中
const loading = ref(false);

// 路由
const router = useRouter();
// 用户状态
const user = useSupabaseUser();

// 检查登录状态
const checkAuth = () => {
  if (!user.value) {
    router.push("/auth/signin");
    return false;
  }
  return true;
};

// 添加emoji
const onHandleEmoji = async () => {
  // 检查登录状态
  if (!checkAuth()) return;

  if (!text.value) {
    toast({
      title: "错误",
      description: "请输入文案",
      variant: "destructive",
    });
    return;
  }

  loading.value = true;
  emojiText.value = "";

  try {
    const data = await $fetch("/api/ai/emoji", {
      method: "POST",
      body: {
        text: text.value,
        type: type.value,
      },
    });
    emojiText.value = data;

    tokenStore.loadUserTokens();
  } catch (error) {
    console.error(error);
    toast({
      title: "错误",
      description: error?.data?.message || "请求失败",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};
</script>
