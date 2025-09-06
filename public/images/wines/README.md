# 葡萄酒图片文件夹

## 使用说明

将你拍摄的葡萄酒图片放在这个文件夹中，然后在葡萄酒数据中引用。

## 文件命名建议

建议使用以下命名格式：
- `wine-{id}-{name}.jpg` - 例如：`wine-1-chateau-margaux-2015.jpg`
- `wine-{id}-{name}-{vintage}.jpg` - 例如：`wine-1-chateau-margaux-2015.jpg`

## 图片要求

- **格式**: JPG, PNG, WebP
- **尺寸**: 建议 800x600 像素或更高
- **大小**: 建议小于 2MB
- **质量**: 清晰，光线充足

## 在数据中引用

在 `src/data/wines.ts` 文件中，将图片路径设置为：

```typescript
{
  // ... 其他字段
  image: '/images/wines/wine-1-chateau-margaux-2015.jpg'
}
```

## 示例

```
public/images/wines/
├── wine-1-chateau-margaux-2015.jpg
├── wine-2-barolo-brunate-2018.jpg
├── wine-3-riesling-kabinett-2020.jpg
└── README.md
```

## 图片优化建议

1. **压缩图片**: 使用在线工具或软件压缩图片
2. **统一尺寸**: 保持相似的宽高比
3. **命名规范**: 使用有意义的文件名
4. **备份**: 保留原始高质量图片的备份
