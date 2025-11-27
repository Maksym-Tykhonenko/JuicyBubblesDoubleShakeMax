import React, {
    useRef as useFizzRef,
    useLayoutEffect as useFizzLayout,
    useEffect as useFizzEff,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation as useFizzNav } from '@react-navigation/native';

import {
    Animated as FizzAnim,
    Dimensions as FizzScene,
    View as FizzStage,
    ImageBackground as FizzBackdrop,
    Easing as FizzEase,
} from 'react-native';

const FIZZ_ONBOARD_KEY = 'doublefizz_onboard_state';

const JuicyBubblesDoubleShakeLoading: React.FC = () => {
    const { width: surfW, height: surfH } = FizzScene.get('window');
    const fizzNav = useFizzNav();

    // --- Base Anim Values ---
    const scalePop = useFizzRef(new FizzAnim.Value(1)).current;
    const flashBlink = useFizzRef(new FizzAnim.Value(0)).current;
    const mistFade = useFizzRef(new FizzAnim.Value(0)).current;
    const shineLayer = useFizzRef(new FizzAnim.Value(0)).current;
    const floatRise = useFizzRef(new FizzAnim.Value(0)).current;

    // --- Logo Pulse ---
    useFizzEff(() => {
        FizzAnim.loop(
            FizzAnim.sequence([
                FizzAnim.timing(scalePop, {
                    toValue: 1.14,
                    duration: 820,
                    easing: FizzEase.inOut(FizzEase.ease),
                    useNativeDriver: true,
                }),
                FizzAnim.timing(scalePop, {
                    toValue: 1,
                    duration: 820,
                    easing: FizzEase.inOut(FizzEase.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scalePop]);

    // --- Sparkles ---
    useFizzEff(() => {
        FizzAnim.loop(
            FizzAnim.sequence([
                FizzAnim.timing(flashBlink, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                FizzAnim.timing(flashBlink, {
                    toValue: 0,
                    duration: 420,
                    useNativeDriver: true,
                }),
                FizzAnim.delay(950 + Math.random() * 900),
            ])
        ).start();
    }, [flashBlink]);

    // --- Gentle Breathing Background ---
    useFizzEff(() => {
        FizzAnim.loop(
            FizzAnim.sequence([
                FizzAnim.timing(mistFade, {
                    toValue: 1,
                    duration: 1600,
                    useNativeDriver: true,
                }),
                FizzAnim.timing(mistFade, {
                    toValue: 0,
                    duration: 1600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [mistFade]);

    // --- Overlay Glint ---
    useFizzEff(() => {
        FizzAnim.loop(
            FizzAnim.sequence([
                FizzAnim.timing(shineLayer, {
                    toValue: 0.45,
                    duration: 220,
                    useNativeDriver: true,
                }),
                FizzAnim.timing(shineLayer, {
                    toValue: 0,
                    duration: 320,
                    useNativeDriver: true,
                }),
                FizzAnim.delay(880),
            ])
        ).start();
    }, [shineLayer]);

    // --- Logo Float ---
    useFizzEff(() => {
        FizzAnim.loop(
            FizzAnim.sequence([
                FizzAnim.timing(floatRise, {
                    toValue: -surfW * 0.05,
                    duration: 740,
                    easing: FizzEase.inOut(FizzEase.ease),
                    useNativeDriver: true,
                }),
                FizzAnim.timing(floatRise, {
                    toValue: 0,
                    duration: 740,
                    easing: FizzEase.inOut(FizzEase.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [floatRise]);

    // --- Init navigation logic ---
    useFizzLayout(() => {
        let onboardNeeded = false;

        const hydrateStartup = async () => {
            try {
                const [hasOnboard, userProfile] = await Promise.all([
                    AsyncStorage.getItem(FIZZ_ONBOARD_KEY),
                    AsyncStorage.getItem('fizzUserData'),
                ]);

                if (!hasOnboard && !userProfile) {
                    onboardNeeded = true;
                    await AsyncStorage.setItem(FIZZ_ONBOARD_KEY, 'true');
                }
            } catch (err) {
                if (__DEV__) console.warn('JuicyBubblesDoubleShakeLoading init error:', err);
            }

            setTimeout(() => {
                fizzNav.replace(
                    onboardNeeded
                        ? 'JuicyBubblesDoubleShakeOnboarding'
                        : 'JuicyBubblesDoubleShakeOnboarding'
                );
            }, 3070);
        };

        hydrateStartup();
    }, [fizzNav]);

    // --- Bubble floating particles ---
    const FIZZ_BUBBLE_COUNT = 7;
    const fizzParticles = Array.from({ length: FIZZ_BUBBLE_COUNT }, () => ({
        bubbleY: new FizzAnim.Value(0),
        bubbleOpacity: new FizzAnim.Value(0),
    }));

    useFizzEff(() => {
        fizzParticles.forEach((bubble, idx) => {
            const loopBubble = () => {
                bubble.bubbleY.setValue(0);
                bubble.bubbleOpacity.setValue(0);
                FizzAnim.parallel([
                    FizzAnim.timing(bubble.bubbleY, {
                        toValue: -surfW * (0.18 + Math.random() * 0.2),
                        duration: 1250 + Math.random() * 600,
                        easing: FizzEase.out(FizzEase.ease),
                        useNativeDriver: true,
                    }),
                    FizzAnim.sequence([
                        FizzAnim.timing(bubble.bubbleOpacity, {
                            toValue: 1,
                            duration: 220,
                            useNativeDriver: true,
                        }),
                        FizzAnim.timing(bubble.bubbleOpacity, {
                            toValue: 0,
                            duration: 880 + Math.random() * 400,
                            useNativeDriver: true,
                        }),
                    ]),
                ]).start(() => {
                    setTimeout(loopBubble, 400 + Math.random() * 750);
                });
            };
            setTimeout(loopBubble, idx * 280);
        });
    }, []);

    // --- Render ---
    return (
        <FizzStage style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Background fade layer */}
            <FizzAnim.View
                style={{
                    height: surfH,
                    position: 'absolute',
                    width: surfW,
                    opacity: mistFade.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.88],
                    }),
                }}
            >
                <FizzBackdrop
                    resizeMode="cover"
                    source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/loadingJuiceBackImg.png')}
                    style={{
                        width: surfW,
                        height: surfH,
                        position: 'absolute',
                    }}
                />
            </FizzAnim.View>

            {/* Logo and floating bubbles */}
            <FizzAnim.View style={{ transform: [{ translateY: floatRise }] }}>
                <FizzBackdrop
                    resizeMode="contain"
                    source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyLogo.png')}
                    style={{
                        width: surfW * 0.55,
                        height: surfW * 0.55,
                        alignSelf: 'center',
                    }}
                />

                <FizzStage
                    pointerEvents="none"
                    style={{
                        top: 0,
                        width: surfW * 0.55,
                        position: 'absolute',
                        height: surfW * 0.55,
                        left: 0,
                        alignSelf: 'center',
                    }}
                >
                    {fizzParticles.map((bubble, idx) => (
                        <FizzAnim.View
                            key={idx}
                            style={{
                                opacity: bubble.bubbleOpacity,
                                left: surfW * 0.14 + Math.sin(idx * 2) * surfW * 0.12,
                                bottom: surfW * 0.08 + Math.cos(idx * 2) * surfW * 0.1,
                                width: surfW * (0.04 + Math.random() * 0.03),
                                borderRadius: 999,
                                position: 'absolute',
                                backgroundColor: 'rgba(255,255,255,0.72)',
                                transform: [{ translateY: bubble.bubbleY }],
                                height: surfW * (0.04 + Math.random() * 0.03),
                            }}
                        />
                    ))}
                </FizzStage>
            </FizzAnim.View>
        </FizzStage>
    );
};

export default JuicyBubblesDoubleShakeLoading;