import React, { useState } from 'react';
import { juicyFonts } from '../juicyFonts';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    StyleSheet,
    Image,
    Alert,
    Share,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JuicyAnimatedAlert from './JuicyAnimatedAlert';

const shareIcon = require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/fortuneShare.png');
const resetIcon = require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/fortuneReset.png');

const { width: vw, height: vh } = Dimensions.get('window');

// Custom switch states
const MUSIC_STATES = ['off', 'low', 'high'];
const MUSIC_COLORS = {
    off: '#E0E0E0',
    low: '#FFD1DF',
    high: '#FC93AA',
};

const ShakeBubbleJuicyFruitySetts: React.FC = () => {
    // Notifications switch (binary, for demo)
    const [notificationsOn, setNotificationsOn] = useState(false);

    // Music switch (cycle through 3 states)
    const [musicStateIdx, setMusicStateIdx] = useState(0);
    const musicState = MUSIC_STATES[musicStateIdx];

    // Switch animation
    const knobAnim = React.useRef(new Animated.Value(musicStateIdx)).current;

    // Animate knob position when state changes
    React.useEffect(() => {
        Animated.timing(knobAnim, {
            toValue: musicStateIdx,
            duration: 180,
            useNativeDriver: false,
        }).start();
    }, [musicStateIdx]);

    // Cycle through music states
    const handleMusicSwitch = () => {
        setMusicStateIdx((prev) => (prev + 1) % MUSIC_STATES.length);
    };

    // Notifications switch logic (binary)
    const handleNotificationsSwitch = () => {
        setNotificationsOn((prev) => !prev);
    };

    // Reset all data handler
    const [showModal, setShowModal] = useState(false);

    const handleResetAllData = () => {
        Alert.alert(
            'Reset all data',
            'Are you sure you want to clear all app data?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        setShowModal(true);
                    }
                }
            ]
        );
    };

    const juicyHandleShare = async () => {
        try {
            await Share.share({
                message: `Juicy Bubbles: Double Shake can help you to find new shakes and fun facts! `,
            });
        } catch (error) {
            // Optionally handle error
        }
    };

    // Styles for switch
    const SWITCH_WIDTH = vw * 0.16;
    const SWITCH_HEIGHT = vh * 0.045;
    const KNOB_SIZE = SWITCH_HEIGHT * 0.8;

    // Animated knob position for music switch
    const knobLeft = knobAnim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [2, SWITCH_WIDTH / 2 - KNOB_SIZE / 2, SWITCH_WIDTH - KNOB_SIZE - 2],
    });

    // Row and icon sizes
    const ROW_HEIGHT = vh * 0.08;
    const ROW_RADIUS = ROW_HEIGHT * 0.5;
    const ROW_PADDING_H = vw * 0.04;
    const ROW_PADDING_V = vh * 0.01;
    const ICON_SIZE = ROW_HEIGHT * 0.45;

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#3AE19C',
            borderRadius: ROW_RADIUS,
            marginVertical: vh * 0.012,
            width: vw * 0.9,
            paddingHorizontal: ROW_PADDING_H,
            paddingVertical: ROW_PADDING_V,
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
            height: ROW_HEIGHT,
            minHeight: ROW_HEIGHT,
            maxHeight: ROW_HEIGHT,
        },
        rowText: {
            fontFamily: 'Poppins-Italic',
            fontSize: vw * 0.045,
            color: '#222',
            flex: 1,
        },
        switch: {
            width: vw * 0.16,
            height: ROW_HEIGHT * 0.6,
            borderRadius: ROW_HEIGHT * 0.3,
            justifyContent: 'center',
            position: 'relative',
        },
        knob: {
            position: 'absolute',
            width: ROW_HEIGHT * 0.48,
            height: ROW_HEIGHT * 0.48,
            borderRadius: ROW_HEIGHT * 0.24,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 2,
            elevation: 2,
            top: (ROW_HEIGHT * 0.6 - ROW_HEIGHT * 0.48) / 2,
        },
    });

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <SafeAreaView />
            <Text
                style={{
                    textShadowRadius: 3,
                    textShadowColor: '#D72E5F',
                    textShadowOffset: { width: 0, height: 1 },
                    fontStyle: 'italic',
                    fontSize: vw * 0.07,
                    textAlign: 'center',
                    color: '#FFD1DF',
                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                    marginBottom: vh * 0.01,
                }}
            >
                Settings
            </Text>
            {/* Notifications row */}
            <View style={styles.row}>
                <Text style={styles.rowText}>Notifications</Text>
                <TouchableOpacity onPress={handleNotificationsSwitch} activeOpacity={0.8}>
                    <View style={[styles.switch, { backgroundColor: notificationsOn ? '#FC93AA' : '#78788084' }]}>
                        <Animated.View style={[styles.knob, {
                            left: notificationsOn ? SWITCH_WIDTH - KNOB_SIZE - 2 : 2,
                            backgroundColor: '#fff',
                        }]} />
                    </View>
                </TouchableOpacity>
            </View>
            {/* Vibration row */}
            <View style={styles.row}>
                <Text style={styles.rowText}>Vibro power</Text>
                <TouchableOpacity onPress={handleMusicSwitch} activeOpacity={0.8}>
                    <View style={[styles.switch, { backgroundColor: MUSIC_COLORS[musicState] }]}>
                        <Animated.View style={[
                            styles.knob,
                            {
                                left: knobLeft,
                                backgroundColor: '#fff',
                            }
                        ]} />
                    </View>
                </TouchableOpacity>
            </View>
            {/* Share the app row */}
            <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={juicyHandleShare}>
                <Text style={styles.rowText}>Share the app</Text>
                <Image source={shareIcon} style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            </TouchableOpacity>
            {/* Reset all data row */}
            <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={handleResetAllData}>
                <Text style={styles.rowText}>Reset all data</Text>
                <Image source={resetIcon} style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            </TouchableOpacity>
            {/* Terms of use row */}
            <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => Linking.openURL('https://www.freeprivacypolicy.com/live/27cd5328-d971-470d-9eda-4021fa7f4590')}>
                <Text style={styles.rowText}>Terms of use</Text>
            </TouchableOpacity>
            <JuicyAnimatedAlert
                visible={showModal}
                text="All data has been successfully cleared!"
                onHide={() => setShowModal(false)}
            />
        </View>
    );
};

export default ShakeBubbleJuicyFruitySetts;