export type Language = "zh" | "en";

export interface Translations {
  nav: {
    about: string;
    projects: string;
    contact: string;
    login: string;
    logout: string;
    manage: string;
    loggedIn: string;
  };
  hero: {
    title: string;
    subtitle: string;
    viewProjects: string;
    contactMe: string;
  };
  about: {
    title: string;
    subtitle: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    tags: string[];
  };
  projects: {
    title: string;
    subtitle: string;
    viewDetails: string;
  };
  articles: {
    title: string;
    subtitle: string;
    readMore: string;
    readAll: string;
    latest: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
  };
  footer: {
    text: string;
  };
}

export const translations: Record<Language, Translations> = {
  zh: {
    nav: {
      about: "关于",
      projects: "项目",
      contact: "联系",
      login: "登录",
      logout: "登出",
      manage: "管理",
      loggedIn: "已登录",
    },
    hero: {
      title: "半梦半醒\n永远年轻，\n永远热泪盈眶",
      subtitle: "我在做社区、文化与技术之间的连接",
      viewProjects: "查看项目",
      contactMe: "联系我",
    },
    about: {
      title: "关于我",
      subtitle: "About Me",
      paragraph1: "我关注人与人之间的连接，相信微小的善意可以汇聚成巨大的能量。",
      paragraph2: "我做项目，但更在意过程中的"人"与"温度"，技术是实现方式，而非目的。",
      paragraph3: "我相信社区、文化与技术可以共存，并致力于探索它们之间有机结合的可能性。",
      tags: ["社区", "文化", "区块链", "实验性项目", "长期主义"],
    },
    projects: {
      title: "我的实践",
      subtitle: "Selected Works",
      viewDetails: "查看详情",
    },
    articles: {
      title: "一些想法",
      subtitle: "关于社区、文化与技术的思考与记录",
      readMore: "阅读更多",
      readAll: "阅读所有文章",
      latest: "最新文章",
    },
    contact: {
      title: "Let's Connect",
      subtitle: "如果你对社区、文化或长期建设感兴趣，\n欢迎联系我，一同探索更多可能。",
      name: "姓名",
      email: "邮箱",
      message: "留言",
      send: "发送",
      sending: "发送中...",
      success: "留言已发送！",
      error: "发送失败，请稍后重试",
    },
    footer: {
      text: "Built slowly, with care.",
    },
  },
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      contact: "Contact",
      login: "Login",
      logout: "Logout",
      manage: "Manage",
      loggedIn: "Logged in",
    },
    hero: {
      title: "Half awake, half dreaming\nForever young,\nForever teary-eyed",
      subtitle: "I'm connecting communities, culture, and technology",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
    },
    about: {
      title: "About Me",
      subtitle: "About Me",
      paragraph1: "I focus on connections between people, believing that small acts of kindness can converge into great energy.",
      paragraph2: "I work on projects, but care more about the 'people' and 'warmth' in the process. Technology is a means, not an end.",
      paragraph3: "I believe communities, culture, and technology can coexist, and I'm committed to exploring the possibilities of their organic integration.",
      tags: ["Community", "Culture", "Blockchain", "Experimental Projects", "Long-termism"],
    },
    projects: {
      title: "My Practice",
      subtitle: "Selected Works",
      viewDetails: "View Details",
    },
    articles: {
      title: "Thoughts",
      subtitle: "Reflections and records on community, culture, and technology",
      readMore: "Read More",
      readAll: "Read All Articles",
      latest: "Latest Articles",
    },
    contact: {
      title: "Let's Connect",
      subtitle: "If you're interested in communities, culture, or long-term building,\nfeel free to reach out and explore possibilities together.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Failed to send, please try again later",
    },
    footer: {
      text: "Built slowly, with care.",
    },
  },
};
