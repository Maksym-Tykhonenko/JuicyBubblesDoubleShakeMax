const bubbleSlideset = [
    require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBubbleWelcomes/juicyBubbleGirleWelcome.png'),
    require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBubbleWelcomes/juicyBubbleRedJuice.png'),
    require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBubbleWelcomes/juicyBubbleYellowJuice.png'),
    require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBubbleWelcomes/juicyBubbleDesert.png'),
];
import {
    Pressable as BubbleTouchy,
    Image as BubbleImg,
    useWindowDimensions as useBubbleViewport,
    Text as BubbleTxt,
    View as BubbleWrapView,
} from 'react-native';
import React, { useState as useBubbleState } from 'react';
import { juicyFonts } from '../juicyFonts';

import { useNavigation as useBubbleRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';


const JuicyBubblesDoubleShakeOnboarding: React.FC = () => {
    const [bubbleIdx, setBubbleIdx] = useBubbleState(0);
    const bubbleRoute = useBubbleRoute();
    const activeVisual = bubbleSlideset[bubbleIdx];
    const { width: stageSpanX, height: stageSpanY } = useBubbleViewport();

    const handleAdvanceBubble = () => {
        const lastIndex = bubbleSlideset.length - 1;
        if (bubbleIdx < lastIndex) {
            setBubbleIdx(prev => prev + 1);
        } else {
            bubbleRoute.replace?.('JuicyBubblesDoubleShakeMainLocalizator');
        }
    };

    return (
        <BubbleWrapView
            style={{
                backgroundColor: '#000',
                height: stageSpanY,
                width: stageSpanX,
                flex: 1,
            }}
        >
            <BubbleImg
                source={activeVisual}
                resizeMode="cover"
                style={{
                    left: 0,
                    height: stageSpanY,
                    width: stageSpanX,
                    top: 0,
                    position: 'absolute',
                }}
            />

            <BubbleTouchy
                style={{
                    top: stageSpanY * 0.07,
                    right: stageSpanX * 0.05,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                }}
                onPress={() => bubbleRoute.replace?.('JuicyBubblesDoubleShakeMainLocalizator')}
            >
                <BubbleTxt
                    style={{
                        fontStyle: 'italic',
                        fontSize: stageSpanX * 0.048,
                        fontFamily: juicyFonts.juicyBubblesPoppinsMedItalic,
                        color: '#FFFFFF',
                    }}
                >
                    Skip
                </BubbleTxt>
            </BubbleTouchy>

            <BubbleTouchy
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: stageSpanY * 0.032,
                    width: stageSpanX * 0.918212,
                    height: stageSpanY * 0.07094,
                    alignSelf: 'center',
                    borderRadius: stageSpanX * 0.072,
                    overflow: 'hidden',
                    position: 'absolute',
                }}
                onPress={handleAdvanceBubble}
            >
                <LinearGradient
                    end={{ x: 0.5, y: 1 }}
                    start={{ x: 0.5, y: 0 }}
                    colors={['#62D837', '#15A906']}
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                    }}
                />
                <BubbleTxt
                    style={{
                        fontSize: stageSpanX * 0.052,
                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                        color: '#FFF',
                    }}
                >
                    {bubbleIdx < bubbleSlideset.length - 1 ? 'Next' : 'Start'}
                </BubbleTxt>
            </BubbleTouchy>
        </BubbleWrapView>
    );
};

export default JuicyBubblesDoubleShakeOnboarding;