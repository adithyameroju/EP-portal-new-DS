# Compass — Figma Component Key Registry

> Maps Compass component names to their Figma library component keys.
> Used by the Write to Figma skill to create proper library instances
> via `importComponentByKeyAsync()` instead of raw frames.
>
> **Library file:** zgzPlhKxDXc3E9OmfxmF9y (ACKO-Enterprise-Design-System-v1.0.0)
> **Last updated:** 2026-05-16

## How to use this file

When writing a design to Figma, look up the component in this table.
Use the **Default Variant Key** with `figma.importComponentByKeyAsync(key)`
to create a proper library instance. Then set variant properties on the
instance to match the desired state.

For component sets (most components), import the default variant key,
then use `instance.setProperties()` to change variant/size/state.

```javascript
// Example: import Button and set variant
const btn = await figma.importComponentByKeyAsync("9072208bc6696d66fa217fbf8248f31db2aad416");
const instance = btn.createInstance();
instance.setProperties({ "Variant": "Secondary" });
```

---

## Component Keys

### Tier 1 — Code Connected (10 components)

| Component | Set Name | Component Set Key | Default Variant Key |
|-----------|----------|------------------|-------------------|
| Button | Button | d2ec72de5481b45279ce9b60d7bf085dc3965303 | 9072208bc6696d66fa217fbf8248f31db2aad416 |
| Card | Card | 8a0c9bbde36248256f9604094621589c3aba4627 | 0eac4951b21351151275f293ecf3bfd37861e6f3 |
| Input | Input | de52381a893354800f0c33efec3a15c8841cf65d | b40d2e24634985a6199c7e3e5b2d559615ab2f0f |
| Dialog | Dialog / Close Icon | 30c92e681a4740f0e1739b90c57748256a0ed6b2 | 7b6d9b2f63590a4cd956110113068aaadcbd4f0d |
| Select | Select | 7063ee09d0b13da35832bd4e12556a4bedc5bf8e | d0989d99199ecbcfc56f970ecd75bde47c9fbdb0 |
| Field | Field | c26d87dd685dd4cdf8d88b29f1fa72ec5f18d91a | 66e5733e375f711c0fd935fc02d871f210fc3252 |
| Table (Head) | Table / Head | 6846d92b5f6794baa0127726c64b16f3ff1ca71d | 11c83c2cd924ad1f8f6317305f272377652c1e1c |
| Table (Cell) | Table / Cell | cef6d4b0459a71dee26ff9b57e513a85ed3b7d0e | 92a90d0fa06cbf8532839ce15956ca92ef72dee5 |
| Tabs | Tabs | 8077eef58fa106ebd92a8284f46667f6e5074a50 | f081eb1a79638543c8696c25129aeaeaa4af37e8 |
| Sheet | Sheet | 20f76aece5461158518cbd7e8d5b789506ca02e1 | 0028c2002dac648ca07f868b63289f211689efb7 |
| Sidebar (MenuButton) | Sidebar / SidebarMenuButton | 615fd676587dfc452cf7e8da73e205ab0fb21c3b | 32169a88b2ccd5b69b7dec810197725f0f46b199 |
| Sidebar (Group) | Sidebar / SidebarGroup | 6442d533ab1822441728df62ff732829838a1c86 | aeb1bc95f39cf8e271548b16cdbf1ea7a48c9df6 |
| Sidebar (GroupLabel) | Sidebar / SidebarGroupLabel | 9a2d6529e742ab53111bb45ba36938ad10b36079 | 70f3201fe625b3f83e2cdcd0cc9d77c71ec3d65e |

### Tier 2 — Spec Coverage (key components)

| Component | Set Name | Component Set Key | Default Variant Key |
|-----------|----------|------------------|-------------------|
| Badge | Badge | 9368f8817fa2f68b59e52b4f33b59c5f66245f99 | 8415023d518c32339795531f2096af0d023bb83c |
| Checkbox | Checkbox | 45324268e4ba50724d9741f5d559a21f6b97889b | ca8d4293cc4e465a5b7617d1eb36c35ed527e87a |
| Switch | Switch | ede2e4a5e353068ebde240dda035ce378084c205 | 60d251b70f107b1c9196362149f0fad1c551a386 |
| Separator | Separator | 7430e10e5a96ffe752ecb5fe6d1d2b3e21e96353 | 5f28da2901ca12c3fd551ef138553f90548f62dd |
| Alert | Alert | 1a14a69ba460584e10825a7f6955f97f89274bf5 | a7168e3ecab36e118537dc55045be0dec149b75f |
| Tooltip | Tooltip | 7a731efbe5ee55e63ca16bb5634a81eb575eaba9 | 8f6c7e421636b4a0ae9480d9f5e3887d13ef9516 |
| Dropdown Menu (Item) | DropdownMenu / Item | b36dd16c7aecd8a2290aaa02137c2d503fa2cc4e | 24e7be81679e7f9f626cbdd088ca71a81d66ac86 |
| Avatar | Avatar | 9af3495487ece44846007d3c8e04023a8d80387c | 81a339179d13e6c34048d0e037ce07ea317c66bb |
| Breadcrumb | Breadcrumb | b9504a2fce02e31af90a5abbda09e47844bb2e78 | 0117345e11a65ad54924131cbce65d5ac8b73ef9 |
| Tabs (Trigger) | Tabs / Trigger | 68de452b9572279a52dc12911686e88afea79b73 | 5053d87a43111036db9eb48697bb3615c94bb25b |
| Select (Item) | Select Menu / Item | 48b9236e79a730b427144330289163e453c1fdb4 | 784060babac6c6b0c6fdb2acfebd587bd4fa4672 |

### Supporting Components

| Component | Set Name | Component Set Key | Default Variant Key |
|-----------|----------|------------------|-------------------|
| Card (Example Content) | Card / Example Content | 7fe28e0ba6d9e234dd35c28f5196b842773b5e40 | e6b4e4d513b0d6fa263103a0fec89a5dd4ff565a |
| Card (Example Footer) | Card / Example Footer | 94ed3060c8a0c153257a39e6f6273d1e3cf0090d | 330bffd25bfb5d3f5c11573fc573ed6edf96c0e1 |
| Dialog (Example Content) | Dialog / Example Content | cb16886d1af9e3b5969da0a3d92e1153fddec24f | fc11e1a621c65e5f8db9cbf9d5f0c9132b7efb9e |
| Sheet (Close Icon) | Sheet / Close Icon | c41399e827b6be8a296e321257a696168447bb50 | f4fd18a338b3cd4c75e7390996716a328b48ee62 |
| Badge (Number) | Badge Number | ce59420e784b27339885ffa34a7e38a9d0a885cc | 1dc6427b2159c6207bdf5694970ab282d8ad79f2 |
| Field (Legend) | Field / Legend | c15c65dfab4b83b7b37665896d9aedc45377f82c | 314d604c93d21ee6fc4eeac668bbe92c307b370b |
| Field (Group) | Field Group | de9ac1fedc3941fbe529f7abe5305093366e90cb | e39d7d8ee4a82b7d11f74973e34e68399dc2276d |
| Sidebar (MenuItem) | Sidebar / SidebarMenuItem | 86358a2dff67a7bdb41f406c40a5c70f1ae8b9e2 | 3d6e68269806c18f6592ee46019e077977bf78c2 |
| Sidebar (MenuSub) | Sidebar / SidebarMenuSub | d8120ef9a9c449c9bec498a99d5bfffa59c06cec | 9cfa31ebadf6fbc38a7ada744ebed825a8513df1 |

---

## How to add new keys

When a new component is added to the Compass Figma library:

1. Open the library file in Figma
2. Navigate to the component's page
3. Select the component set
4. In the Plugin API console or via Figma MCP, run:
   `node.key` on the component set and `node.children[0].key` for the default variant
5. Add the entry to the appropriate tier table above
