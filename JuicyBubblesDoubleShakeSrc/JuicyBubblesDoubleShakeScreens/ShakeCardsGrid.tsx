import React from 'react';
import { View, TouchableOpacity, Text, Animated, Image, Dimensions } from 'react-native';
import { juicyFonts } from '../juicyFonts';

const juicyCategories = [
    { title: 'Strawberry', emoji: '🍓', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Strawberry.png') },
    { title: 'Banana', emoji: '🍌', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Banana.png') },
    { title: 'Blueberry', emoji: '🫐', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Blueberry.png') },
    { title: 'Watermelon', emoji: '🍉', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Watermelon.png') },
    { title: 'Lemon', emoji: '🍋', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Lemon.png') },
    { title: 'Orange', emoji: '🍊', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Orange.png') },
];

const getCategoryImg = (cat: string) => {
    const found = juicyCategories.find(c => c.title === cat);
    return found ? found.juicyCatImg : null;
};

const { width: juicyWidBub, height: juicyHighBub } = Dimensions.get('window');

const ShakeCardsGrid = ({
    shakes,
    onCardPress,
    onCardLongPress,
}: {
    shakes: any[],
    onCardPress?: (shake: any) => void,
    onCardLongPress?: (shake: any) => void,
}) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {shakes.map((shake, idx) => (
            <TouchableOpacity
                key={shake.name + idx}
                activeOpacity={0.8}
                onPress={() => onCardPress && onCardPress(shake)}
                onLongPress={() => onCardLongPress && onCardLongPress(shake)}
            >
                <View
                    style={{
                        justifyContent: 'flex-start',
                        backgroundColor: '#FFD1DF',
                        borderRadius: juicyWidBub * 0.06,
                        width: juicyWidBub * 0.42,
                        shadowRadius: 6,
                        margin: juicyWidBub * 0.025,
                        padding: juicyWidBub * 0.04,
                        alignItems: 'center',
                        shadowColor: '#FC93AA',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        height: juicyHighBub * 0.37,
                    }}
                >
                    <Image
                        source={getCategoryImg(shake.category)}
                        style={{ width: juicyWidBub * 0.35, height: juicyWidBub * 0.35, marginBottom: juicyWidBub * 0.025 }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: juicyWidBub * 0.045,
                            marginBottom: juicyWidBub * 0.015,
                            color: '#D72E5F',
                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                        }}
                    >
                        {shake.name}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {shake.tags.map(tag => (
                            <View
                                key={tag}
                                style={{
                                    paddingVertical: juicyWidBub * 0.005,
                                    borderRadius: juicyWidBub * 0.03,
                                    paddingHorizontal: juicyWidBub * 0.02,
                                    backgroundColor: '#3AE19C',
                                    margin: juicyWidBub * 0.005,
                                }}
                            >
                                <Animated.Text
                                    style={{
                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        fontSize: juicyWidBub * 0.03,
                                        color: 'white',
                                    }}
                                >
                                    {tag}
                                </Animated.Text>
                            </View>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        ))}
    </View>
);

export default ShakeCardsGrid;
