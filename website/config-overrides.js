const { override, fixBabelImports, addLessLoader } = require('customize-cra');
 
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
       '@primary-color': '#5b5ce1',
       '@layout-header-background': '#ffffff',
       '@font-size-base': '16px',
       '@border-radius-base': '20px'
      },
    },
  }),
);

