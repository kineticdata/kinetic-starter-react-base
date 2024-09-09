export const getDesignTokens = mode => {
    return ({  
      typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PlusJakartaSans',
        ].join(','),
      },
      shape: {
        borderRadius: 12,
      },
      palette: {
        mode,
        ...(mode === 'light'
          ? {
            text: {
              primary: '#293e7c',
              secondary: '#242f4d',
            },
            primary: {
              main: '#293e7c',
              secondary: '#3f46d6',
              tertiary: '#979cfe',
              quaternary: '#ecedfe',
            },
            secondary:{
              main: '#ca5d3c',
              secondary: '#f36c23',
              tertiary: '#f8945f',
              quaternary: '#fde5d8',
            },
            success: {
              main: '#1a5252',
              secondary: '#68c88f',
              tertiary: '#96d9b1',
              quaternary: '#d9f4e4',
            },
            error: {
              main: '#a42935',
              secondary: '#dc3545',
              tertiary: '#f55c6b',
              quaternary: '#f9dee2',
            },
            warning: {
              main: '#a46429',
              secondary: '#ffb73b',
              tertiary: '#f8c97a',
              quaternary: '#fff6e0',
            },
            greyscale: {
              main: '#242f4d',
              secondary: '#8a8b9d',
              tertiary: '#ced0d2',
              quaternary: '#f4f5f7',
              quinary: '#fff'
            }
          }
          : {
              // palette values for dark mode
              primary: {
                  main: '#ca5d3c'
              },
              // This is a test of just adding a new key/color
              // The is called in the SubmitPointsModal
              // in the Button w/ 'color="brandColor"
              brandColor: {
                  main: '#68c88f'
              },
              // background: {
              //   default: '#a42935',
              // },
              text: {
                  primary: '#a42935',
                  secondary: '#242f4d',
                },
            }),
          },
        }
      )
    };
  