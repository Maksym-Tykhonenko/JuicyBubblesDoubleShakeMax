import React, { useState as useShakeState } from 'react';

import ShakeMainScene from './BubbleShakeJuicyMain';
import {
    Platform as ShakePlatform,
    Dimensions as ShakeDims,
    View as ShakeStageBox,
    Image as ShakeIco,
    Pressable as ShakeTap,
} from 'react-native';

import ShakeBubbleJuicyCollections from './ShakeBubbleJuicyCollections';
import ShakeBubbleJuicyInventions from './ShakeBubbleJuicyInventions';
import ShakeBubbleJuicyFruityFactTap from './ShakeBubbleJuicyFruityFactTap';
import ShakeBubbleJuicyFruitySetts from './ShakeBubbleJuicyFruitySetts';

const { width: juicyStageW, height: juicyStageH } = ShakeDims.get('window');

type JuicyBubbleZone =
    | 'Juicy DoubleShake Home'
    | 'Juicy DoubleShake Inventions'
    | 'Juicy DoubleShake Collections'
    | 'Juicy DoubleShake Facts'
    | 'Juicy DoubleShake Settings';

const bubbleDockSet = [
    {
        juicyZone: 'Juicy DoubleShake Home' as JuicyBubbleZone,
        juicyIcon: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBarIcons/home.png'),
    },
    {
        juicyZone: 'Juicy DoubleShake Collections' as JuicyBubbleZone,
        juicyIcon: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBarIcons/collections.png'),
    },
    {
        juicyZone: 'Juicy DoubleShake Inventions' as JuicyBubbleZone,
        juicyIcon: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBarIcons/inventions.png'),
    },
    {
        juicyZone: 'Juicy DoubleShake Facts' as JuicyBubbleZone,
        juicyIcon: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBarIcons/fruityFactTap.png'),
    },
    {
        juicyZone: 'Juicy DoubleShake Settings' as JuicyBubbleZone,
        juicyIcon: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBarIcons/settings.png'),
    },
];

const JuicyBubblesDoubleShakeMainLocalizator: React.FC = () => {
    const [viewportJuicy, setViewportJuicy] = useShakeState({
        width: juicyStageW,
        height: juicyStageH,
    });
    const [activeBubbleZone, setActiveBubbleZone] = useShakeState<JuicyBubbleZone>('Juicy DoubleShake Home');
    const [vibroFizz, setVibroFizz] = useShakeState(false);

    const renderBubbleScene = () => {
        switch (activeBubbleZone) {
            case 'Juicy DoubleShake Home':
                return <ShakeMainScene setPulseScreen={setActiveBubbleZone} />;
            case 'Juicy DoubleShake Facts':
                return <ShakeBubbleJuicyFruityFactTap />;
            case 'Juicy DoubleShake Inventions':
                return <ShakeBubbleJuicyInventions />;
            case 'Juicy DoubleShake Settings':
                return (
                    <ShakeBubbleJuicyFruitySetts
                        isShakeVibroPower={vibroFizz}
                        setShakeVibroPower={setVibroFizz}
                    />
                );
            case 'Juicy DoubleShake Collections':
                return <ShakeBubbleJuicyCollections />;
            default:
                return null;
        }
    };

    return (
        <ShakeStageBox
            style={{
                backgroundColor: '#D9FFE5',
                height: viewportJuicy.height,
                flex: 1,
                width: viewportJuicy.width,
            }}
        >
            {ShakePlatform.OS === 'android' && (
                <ShakeStageBox style={{ paddingTop: viewportJuicy.height * 0.0405345 }} />
            )}

            {renderBubbleScene()}

            <ShakeStageBox
                style={{
                    backgroundColor: '#3BE49D',
                    alignSelf: 'center',
                    bottom: viewportJuicy.height * 0.035,
                    width: viewportJuicy.width * 0.84,
                    height: viewportJuicy.height * 0.08,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: viewportJuicy.width * 0.05,
                    paddingHorizontal: viewportJuicy.width * 0.014,
                    position: 'absolute',
                }}
            >
                {bubbleDockSet.map((dock, idx) => (
                    <ShakeTap
                        key={idx}
                        onPress={() => setActiveBubbleZone(dock.juicyZone)}
                        style={{
                            justifyContent: 'center',
                            height: viewportJuicy.height * 0.068,
                            alignItems: 'center',
                            backgroundColor:
                                activeBubbleZone === dock.juicyZone ? '#FD97AC' : '#D9FFE5',
                            borderRadius: viewportJuicy.width * 0.04,
                            width: viewportJuicy.height * 0.068,
                        }}
                    >
                        <ShakeIco
                            source={dock.juicyIcon}
                            style={{
                                width: viewportJuicy.height * 0.028,
                                tintColor:
                                    activeBubbleZone === dock.juicyZone ? '#fff' : '#3BE49D',
                                height: viewportJuicy.height * 0.028,
                            }}
                            resizeMode="contain"
                        />
                    </ShakeTap>
                ))}
            </ShakeStageBox>
        </ShakeStageBox>
    );
};

export default JuicyBubblesDoubleShakeMainLocalizator;