# Hysteria2Clash

Hysteria2Clash 是一个面向 Hysteria2/HY2 节点的订阅转换前端，重点优化 Hysteria2 链接导出 Clash 订阅时的兼容性。项目保留常规订阅转换能力，同时把 Hysteria2 处理集成进默认“生成订阅链接”流程，适合把 Hysteria2、Trojan、VLESS 等链接放在一起生成统一订阅。

## 本次更新

- 将项目品牌更新为 `Hysteria2Clash`。
- 默认后端调整为 `https://api.v1.mk`。
- 默认远程配置调整为 ACL4SSR 的 `ACL_精简版`。
- 移除首次打开页面的弹窗和自动后端版本提示，减少初次使用干扰。
- Hysteria2/HY2 链接会在默认订阅链接中自动规范化，不再走单独的 ini 或文本托管输出。
- 当输入包含 Hysteria2/HY2 链接时，生成链接自动启用 `udp=true` 和 `scv=true`。
- 支持多个链接混合输入，每行一个或使用 `|` 分隔。

## Hysteria2 处理规则

输入 Hysteria2/HY2 链接后，项目会在生成默认订阅链接时自动处理：

- 为缺少 `alpn` 的 Hysteria2 链接补充 `alpn=h3`。
- IP 直连且未设置 SNI/peer/servername 时，自动将 `insecure` 调整为 `1`。
- 节点名称自动补充 `-hy2` 后缀，方便在 Clash 中识别。
- 非 Hysteria2 链接保持原样，可与 Trojan、VLESS 等链接一起导出。

示例输入：

```text
hysteria2://Miles23.Godislove@185.238.248.115:1816/?insecure=0&mport=20000-30000#111
trojan://password@example.com:443?sni=example.com#trojan-node
```

生成时会保留默认订阅转换链接格式：

```text
https://api.v1.mk/sub?target=clash&url=...&config=...&udp=true&scv=true&new_name=true
```

## 本地运行

```bash
yarn install
yarn serve
```

## 构建

```bash
yarn build
```

## Docker 本地构建

```bash
docker build -t hysteria2clash .
docker run -d --restart always -p 8090:80 --name hysteria2clash hysteria2clash
```

访问示例：

```text
http://127.0.0.1:8090/
```

## 说明

本项目基于订阅转换前端改造，主要目标是让 Hysteria2 节点在 Clash 导出场景下更省心，同时保持原有多客户端订阅转换体验。
