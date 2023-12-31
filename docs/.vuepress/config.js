module.exports = {
    base: "/zaff/",
    title: "ZAff",
    description: "ES module for processing arcaea file format",
    themeConfig: {
        nav: [
            {
                text: "主页",
                link: "/"
            },
            {
                text: "Github",
                link: "https://github.com/KazariEX/zaff"
            }
        ],
        sidebar: [
            {
                title: "快速开始",
                path: "/quick/",
                collapsable: false,
                sidebarDepth: 3,
                children: [
                    "/quick/",
                    "/quick/download",
                    "/quick/base"
                ]
            },
            {
                title: "进阶",
                collapsable: false,
                sidebarDepth: 3,
                children: [
                    "/advance/easing"
                ]
            }
        ]
    }
};