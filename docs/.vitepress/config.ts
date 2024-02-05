import { defineConfig } from "vitepress";

export default defineConfig({
    title: "ZAff",
    description: "ES module for processing arcaea file format",
    lang: "zh-CN",
    base: "/zaff/",
    themeConfig: {
        nav: [
            {
                text: "主页",
                link: "/"
            },
            {
                text: "文档",
                link: "/quick/"
            },
            {
                text: "Github",
                link: "https://github.com/KazariEX/zaff"
            }
        ],
        sidebar: [
            {
                text: "快速开始",
                collapsed: false,
                items: [
                    {
                        text: "简介",
                        link: "/quick/"
                    },
                    {
                        text: "安装",
                        link: "/quick/download"
                    },
                    {
                        text: "基础",
                        link: "/quick/base"
                    }
                ]
            },
            {
                text: "进阶",
                collapsed: false,
                items: [
                    {
                        text: "缓动",
                        link: "/advance/easing"
                    }
                ]
            }
        ],
        footer: {
            message: "MIT License",
            copyright: "Copyright © 2023-2024 KazariEX"
        },
        search: {
            provider: "local"
        },
        outline: {
            label: "页面导航",
            level: "deep"
        }
    }
});