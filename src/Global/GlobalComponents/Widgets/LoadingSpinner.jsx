import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';
import Box from '@mui/material/Box';

export const LoadingSpinner = ({ error }) => {

    return error ? 
        <ErrorDisplay error={error} /> :
        (
            <Box 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    mb: '1rem',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <Box 
                    sx={{
                        width: '14.375rem',
                        height: '14.375rem',
                        border: '.625rem solid',
                        borderColor: 'secondary.secondary',
                        borderTop: '.625rem solid transparent',
                        borderRadius: '50%',

                        transitionProperty: 'transform',
                        animationName: 'rotate',
                        animationDuration: '1.2s',
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear',

                        WebkitTransitionProperty: '-webkit-transform',
                        WebkitTransitionDuration: '1.2s',
                        WebkitAnimationName: 'rotate',
                        WebkitAnimationIterationCount: 'infinite',
                        WebkitAnimationTimingFunction: 'linear',

                        '@keyframes rotate': {
                            '0%': {transform: 'rotate(0deg)'},
                            '100%': {transform: 'rotate(360deg)'}
                        },

                        '@-webkit-keyframes rotate': {
                            '0%': {'WebkitTransform': 'rotate(0deg)'},
                            '100%': {'WebkitTransform': 'rotate(360deg)'}
                        }
                    }}
                />
            </Box>
        );
};