import React, {useState } from 'react';
import { juicyFonts } from '../juicyFonts';
import {
    Image as ShakeImage,
    View as ShakeViewBubbles,
    Text as ShakeTextJuicy,
    Dimensions as ShakeDimension,
    TouchableOpacity as TouchableJuicy,
    SafeAreaView as JuicyShakeAreSafe,
    Animated,
    Share,
} from 'react-native';
import juicyBubblesFacts from '../JuicyBubblesDataDoubleShake/juicyBubblesFacts';
import LinearGradient from 'react-native-linear-gradient';

const closedCookieImg = require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/fortuneCookieClosed.png'); // add your image path
const openedCookieImg = require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/fortuneCookieOpen.png');   // add your image path
const shareIcon = require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/fortuneShare.png');                  // add your image path

const ShakeBubbleJuicyFruityFactTap: React.FC = () => {
    const { width: juicyWidBub, height: juicyHighBub } = ShakeDimension.get('window');
    const [showFact, setShowFact] = useState(false);
    const [factIdx, setFactIdx] = useState(0);
    const [animating, setAnimating] = useState(false);

    // Animation values
    const cookieTranslateY = React.useRef(new Animated.Value(0)).current;
    const cookieShake = React.useRef(new Animated.Value(0)).current;

    const handleTapCookie = () => {
        if (animating) return;
        setAnimating(true);
        Animated.sequence([
            Animated.timing(cookieTranslateY, {
                toValue: -40,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(cookieShake, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(cookieShake, {
                toValue: -1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(cookieShake, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(cookieTranslateY, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowFact(true);
            setAnimating(false);
        });
    };

    const handleNextFact = () => {
        setFactIdx((prev) => (prev + 1) % juicyBubblesFacts.length);
        setShowFact(false);
    };

    return (
        <ShakeViewBubbles style={{ flex: 1, alignItems: 'center' }}>
            <JuicyShakeAreSafe />
            <ShakeTextJuicy
                style={{
                    textShadowRadius: 3,
                    textShadowColor: '#D72E5F',
                    textShadowOffset: { width: 0, height: 1 },
                    fontStyle: 'italic',
                    fontSize: juicyWidBub * 0.07,
                    textAlign: 'center',
                    color: '#FFD1DF',
                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                    marginBottom: juicyHighBub * 0.01,
                }}
            >
                Fruity Fact Tap
            </ShakeTextJuicy>
            <ShakeViewBubbles style={{ flex: 1, alignItems: 'center', width: '100%' }}>
                {!showFact ? (
                    <>
                        <TouchableJuicy onPress={handleTapCookie} activeOpacity={0.8} disabled={animating}>
                            <Animated.View
                                style={{
                                    transform: [
                                        { translateY: cookieTranslateY },
                                        {
                                            rotate: cookieShake.interpolate({
                                                inputRange: [-1, 1],
                                                outputRange: ['-8deg', '8deg'],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <ShakeImage
                                    source={closedCookieImg}
                                    style={{ width: juicyWidBub * 0.7, height: juicyWidBub * 0.7, marginBottom: 20 }}
                                    resizeMode="contain"
                                />
                            </Animated.View>
                        </TouchableJuicy>
                        <ShakeTextJuicy
                            style={{
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                color: '#222',
                                textAlign: 'center',
                                marginTop: 10,
                                fontStyle: 'italic',
                                fontSize: juicyWidBub * 0.04,
                            }}
                        >
                            Tap the cookie and unwrap your juicy fact!
                        </ShakeTextJuicy>
                    </>
                ) : (
                    <>
                        <ShakeImage
                            source={openedCookieImg}
                            style={{ width: juicyWidBub * 0.7, height: juicyWidBub * 0.7, marginBottom: 10 }}
                            resizeMode="contain"
                        />
                        <ShakeViewBubbles
                            style={{
                                marginBottom: 18,
                                borderRadius: 18,
                                padding: 18,
                                alignItems: 'center',
                                width: juicyWidBub * 0.8,
                                backgroundColor: '#5CF6B8',
                            }}
                        >
                            <ShakeTextJuicy
                                style={{
                                    textShadowColor: '#fff',
                                    textShadowRadius: 2,
                                    fontSize: juicyWidBub * 0.045,
                                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                                    textAlign: 'center',
                                    textShadowOffset: { width: 0, height: 1 },
                                    fontStyle: 'italic',
                                    color: '#FF5FA2',
                                }}
                            >
                                {juicyBubblesFacts[factIdx]}
                            </ShakeTextJuicy>
                            <TouchableJuicy style={{
                                marginTop: 12,
                                backgroundColor: '#FFD1DF',
                                borderRadius: juicyWidBub * 0.0431,
                                padding: 12,
                            }} onPress={() => {Share.share({ message: juicyBubblesFacts[factIdx] })}}>
                                <ShakeImage source={shareIcon} style={{ width: 25, height: 25 }} />
                            </TouchableJuicy>
                        </ShakeViewBubbles>

                        <TouchableJuicy
                            style={{
                                borderRadius: juicyWidBub * 0.048,
                                overflow: 'hidden',
                                width: juicyWidBub * 0.885439634,
                                marginTop: juicyHighBub * 0.03,
                                justifyContent: 'center',
                                height: juicyHighBub * 0.055094,
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}
                            onPress={handleNextFact}
                        >
                            <LinearGradient
                                colors={['#62D837', '#15A906']}
                                start={{ x: 0.5, y: 0 }}
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                }}
                                end={{ x: 0.5, y: 1 }}
                            />
                            <ShakeTextJuicy
                                style={{
                                    fontSize: juicyWidBub * 0.04,
                                    fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                    color: '#FFF',
                                }}
                            >
                                Next fact
                            </ShakeTextJuicy>
                        </TouchableJuicy>
                    </>
                )}
            </ShakeViewBubbles>
        </ShakeViewBubbles>
    );
};

export default ShakeBubbleJuicyFruityFactTap;