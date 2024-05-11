// see https://nextra.site/docs/docs-theme/theme-configuration
export default {
  docsRepositoryBase: 'https://github.com/cuvar/vocab/tree/main/docs',
  logo: <div className="flex space-x-2 items-center font-bold"><img src="/icon.png" height={50} /><span>vocab</span></div>,
  project: {
    link: 'https://github.com/cuvar/vocab'
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://nextra.site" target="_blank">
          cuvar
        </a>
        .
      </span>
    )
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="vocab" />
      <meta property="og:description" content="A simple flash cards app for learning stuff" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s - vocab'
    }
  }
}