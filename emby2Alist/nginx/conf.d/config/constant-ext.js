import commonConfig from "./constant-common.js";

const strHead = commonConfig.strHead;
const ruleRef = commonConfig.ruleRef;

// 选填项,特定平台功能,用不到保持默认即可

// 图片缓存策略,包括主页、详情页、图片库的原图,路由器 nginx 请手动调小 conf 中 proxy_cache_path 的 max_size
// 0: 不同尺寸设备共用一份缓存,先访问先缓存,空间占用最小但存在小屏先缓存大屏看的图片模糊问题
// 1: 不同尺寸设备分开缓存,空间占用适中,命中率低下,但契合 emby 的图片缩放处理
// 2: 不同尺寸设备共用一份缓存,空间占用最大,移除 emby 的缩放参数,直接原图高清显示
// 3: 关闭 nginx 缓存功能,已缓存文件不做处理
const imageCachePolicy = 0;

// 对接 emby 通知管理员设置,目前只发送是否直链成功,依赖 emby/jellyfin 的 webhook 配置并勾选外部通知
const embyNotificationsAdmin = {
  enable: false,
  includeUrl: false, // 链接太长,默认关闭
  name: "【emby2Alist】",
};

// 对接 emby 设备控制推送通知消息,目前只发送是否直链成功,此处为统一开关,范围为所有的客户端,通知目标只为当前播放的设备
const embyRedirectSendMessage = {
  enable: false,
  header: "【emby2Alist】",
  timeoutMs: -1, // 消息通知弹窗持续毫秒值
};

// 按路径匹配规则隐藏部分接口返回的 items
// 参数1: 0: startsWith(str), 1: endsWith(str), 2: includes(str), 3: match(/ain/g)
// 参数2: 匹配目标,对象为 Item.Path
// 参数3: 0: 默认同时过滤下列所有类型接口, 1: 只隐藏[搜索建议(不会过滤搜索接口)]接口,
// 2: 只隐藏[更多类似(若当前浏览项目位于规则中,将跳过隐藏)]接口, 3: 只隐藏第三方使用的[海报推荐]接口
const itemHiddenRule = [
  // [0, "/mnt/sda1"],
  // [1, ".mp3", 1],
  // [2, "Google", 2],
  // [3, /private/ig],
];

// 串流配置
const streamConfig = {
  // 默认不启用,因违反 HTTP 规范,链接中携带未编译中文,可能存在兼容性问题,如发现串流访问失败,请关闭此选项,
  // !!! 谨慎开启,启用后将修改直接串流链接为真实文件名,方便第三方播放器友好显示和匹配,
  // 该选项只对 emby 有用, jellyfin 为前端自行拼接的
  useRealFileName: false,
};

// 搜索接口增强配置
const searchConfig = {
  // 开启脚本的部分交互性功能
  interactiveEnable: false,
  // 快速交互,启用后将根据指令头匹配,直接返回虚拟搜索结果,不经过回源查询,优化搜索栏失焦的自动搜索
  interactiveFast: false,
  // 限定交互性功能的隔离,取值来源为带参数的 request_uri 字符串
  // 不带协议与域名,仅作包含匹配,多个值为或的关系,未定义或空数组为不隔离
  //interactiveEnableRule: [
  //  "ac0d220d548f43bbb73cf9b44b2ddf0e", // request_uri path level userId
  //  "2d427412-43e1-49e4-a1db-fa17c04d49db", // X-Emby-Device-Id
  //],
};

// 115网盘 web cookie, 会覆盖从 alist 获取到的 cookie
const webCookie115 = "";
// 网盘转码直链配置,当前仅支持 115(必填 webCookie115) 和 emby 挂载媒体环境
const directHlsConfig = {
  enable: false,
  // 仅在首次占位未获取清晰度时,默认播放最小,开启后默认播放最大,版本缓存有效期内客户端自行选择
  defaultPlayMax: false,
  // 启用规则,仅在 enable = true 时生效
  enableRule: ruleRef.directHlsEnable ?? [],
};

// PlaybackInfo 接口的一些增强配置
const playbackInfoConfig = {
  // 多版本播放源排序规则,对接口数据 MediaSources 数组进行排序,优先级从上至下,数组内从左至右,支持正则表达式
  // Key 使用'.'进行层级,分割后的键按层级从 MediaSources 获取,根据分割键获取下一层值时若对象为数组,则过滤[Type === 分割键]的第一行数据
  // (如: 'MediaStreams.Video.Height'规则中 MediaSources.MediaStreams 值为数组,则取数组中[Type === 'Video']的对象的 Height 值)
  // ':length'为关键字,用于数组长度排序
  sourcesSortRules: {
    // 'Path': ['1080p', '720p', '480p', "hevc", "h265", "h264"],
    // 'MediaStreams.Video.Height': 'desc',
    // 'MediaStreams.Video.Codec': ["hevc", "h265", "h264"],
    // 'MediaStreams.Subtitle:length': 'desc',
    // 'MediaStreams.Video.BitRate': 'asc',
  },
}

export default {
  imageCachePolicy,
  embyNotificationsAdmin,
  embyRedirectSendMessage,
  itemHiddenRule,
  streamConfig,
  searchConfig,
  webCookie115,
  directHlsConfig,
  playbackInfoConfig,
}
