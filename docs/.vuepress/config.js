module.exports = {
    base: "/ZAff/",
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
                link: "https://github.com/MysteryBao37/ZAff"
            }
        ],
        sidebar: [
            {
                title: "快速开始",
                path: "/quick/",
                sidebarDepth: 3,
                children: [
                    "/quick/",
                    "/quick/download",
                    "/quick/base"
                ]
            }
        ]
    }
};