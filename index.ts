import AutoZip from './autoZip'

export default (api) => {
  api.describe({
    key: 'zipParams',
    config: {
      schema(joi) {
        return  joi.object({
          buildDir: joi.string(),
          name: joi.string(),
          showTime: joi.boolean(),
          open: joi.boolean()
        })
      },
    },
  })

  api.onBuildComplete(({ err }) => {
    if (!err) {
      if (api.userConfig.zipParams && api.userConfig.zipParams.open) {
        const ZipIns = new AutoZip(api.userConfig.zipParams)
        ZipIns.zip()
      }
    }
  })
};
