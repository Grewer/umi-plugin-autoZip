import AutoZip from './autoZip'

export default (api) => {
  api.describe({
    key: 'zipParams',
    config: {
      schema(joi) {
        return joi
      },
    },
  })

  api.onBuildComplete(({ err }) => {
    if (!err) {
      if (api.userConfig.zipParams) {
        const ZipIns = new AutoZip(api.userConfig.zipParams)
        ZipIns.zip()
      }
    }
  })
};
