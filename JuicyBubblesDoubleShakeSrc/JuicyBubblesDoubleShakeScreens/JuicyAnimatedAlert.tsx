import React, { useEffect, useRef } from 'react';
import { Modal, View, Animated, Dimensions, Text } from 'react-native';
import { juicyFonts } from '../juicyFonts';

const { width: vw, height: vh } = Dimensions.get('window');

interface JuicyAnimatedAlertProps {
    visible: boolean;
    text: string;
    onHide?: () => void;
    duration?: number;
}

const JuicyAnimatedAlert: React.FC<JuicyAnimatedAlertProps> = ({
    visible,
    text,
    onHide,
    duration = 1800,
}) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(anim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }).start();
            const timeout = setTimeout(() => {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }).start(() => {
                    if (onHide) onHide();
                });
            }, duration);
            return () => clearTimeout(timeout);
        }
    }, [visible, anim, onHide, duration]);

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.18)',
            }}>
                <Animated.View style={{
                    opacity: anim,
                    transform: [{
                        scale: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                        })
                    }],
                    backgroundColor: '#fff',
                    borderRadius: 18,
                    width: vw * 0.9153450,
                    paddingVertical: vh * 0.03,
                    paddingHorizontal: vw * 0.09,
                    shadowOpacity: 0.18,
                    shadowColor: '#000',
                    shadowRadius: 12,
                    elevation: 8,
                }}>
                    <Text style={{
                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                        fontSize: vw * 0.045,
                        color: '#003F25',
                        textAlign: 'center',
                        fontStyle: 'italic',
                    }}>
                        {text}
                    </Text>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default JuicyAnimatedAlert;
