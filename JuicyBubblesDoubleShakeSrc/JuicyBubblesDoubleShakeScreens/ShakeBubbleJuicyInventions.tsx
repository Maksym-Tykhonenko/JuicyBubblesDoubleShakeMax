import { juicyFonts } from '../juicyFonts';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TextInput,
    View as JuicyViewShake,
    ScrollView,
    Text as ShakeTextJuicy,
    Image as JuicyShakeImg,
    Dimensions as JuicyShakeScreenSizes,
    SafeAreaView,
    TouchableOpacity as ShakeTouchJuicy,
    Modal,
    SafeAreaView as JuicyShakeAreSafe,
    Alert,
    Animated,
    Pressable,
} from 'react-native';
import JuicyAnimatedAlert from './JuicyAnimatedAlert';

const initialDrink = {
    name: '',
    ingredients: [''],
    steps: [''],
    tags: [],
    photo: '',
};

const JUICY_INV_STORAGE_KEY = 'juicyInventions';

function generateJuicyId() {
    return (
        Date.now().toString(36) +
        Math.random().toString(36).substr(2, 6)
    );
}

const ShakeBubbleJuicyInventions: React.FC = () => {
    const { width: juicyWidBub, height: juicyHighBub } = JuicyShakeScreenSizes.get('window');
    const handleOpenCreateModal = () => setModalVisible(true);
    const [newDrink, setNewDrink] = useState(initialDrink);
    const [modalVisible, setModalVisible] = useState(false);

    const [juicyInventions, setJuicyInventions] = useState<any[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deleteModalAnim = React.useRef(new Animated.Value(0)).current;

    const handleCloseModal = () => {
        setModalVisible(false);
        setNewDrink(initialDrink);
    }

    const isOpacity = newDrink.name.trim() && newDrink.ingredients[0].trim() && newDrink.steps[0].trim() && newDrink.photo.trim();

    // Ingredient/Step add/remove handlers
    const handleAddIngredient = () =>
        setNewDrink({ ...newDrink, ingredients: [...newDrink.ingredients, ''] });
    const handleRemoveIngredient = (idx: number) =>
        setNewDrink({
            ...newDrink,
            ingredients: newDrink.ingredients.filter((_, i) => i !== idx),
        });
    const handleIngredientChange = (text: string, idx: number) =>
        setNewDrink({
            ...newDrink,
            ingredients: newDrink.ingredients.map((ing, i) => (i === idx ? text : ing)),
        });

    const handleAddStep = () =>
        setNewDrink({ ...newDrink, steps: [...newDrink.steps, ''] });
    const handleRemoveStep = (idx: number) =>
        setNewDrink({
            ...newDrink,
            steps: newDrink.steps.filter((_, i) => i !== idx),
        });
    const handleStepChange = (text: string, idx: number) =>
        setNewDrink({
            ...newDrink,
            steps: newDrink.steps.map((step, i) => (i === idx ? text : step)),
        });

    const handlePickImage = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setNewDrink({ ...newDrink, photo: response.assets[0].uri || '' });
                }
            }
        );
    };

    useEffect(() => {
        const loadInventions = async () => {
            try {
                const stored = await AsyncStorage.getItem(JUICY_INV_STORAGE_KEY);
                if (stored) {
                    setJuicyInventions(JSON.parse(stored));
                }
            } catch (e) {
                // handle error if needed
            }
        };
        loadInventions();
    }, []);

    const handleSaveDrink = async () => {
        const newObj = {
            ...newDrink,
            id: generateJuicyId(),
        };
        const updated = [...juicyInventions, newObj];
        setJuicyInventions(updated);
        await AsyncStorage.setItem(JUICY_INV_STORAGE_KEY, JSON.stringify(updated));
        setModalVisible(false);
        setNewDrink(initialDrink);
    };

    // Delete invention handler
    const handleDeleteInvention = (id: string) => {
        Alert.alert(
            'Delete shake',
            'Are you sure you want to delete this shake?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updated = juicyInventions.filter(item => item.id !== id);
                        setJuicyInventions(updated);
                        await AsyncStorage.setItem(JUICY_INV_STORAGE_KEY, JSON.stringify(updated));
                        setShowDeleteModal(true);
                    }
                }
            ]
        );
    };

    return (
        <JuicyViewShake style={{ flex: 1, }}>
            <JuicyShakeAreSafe />
            <ShakeTextJuicy
                style={{
                    marginBottom: juicyHighBub * 0.01,
                    textShadowRadius: 3,
                    textShadowColor: '#D72E5F',
                    color: '#FFD1DF',
                    fontStyle: 'italic',
                    fontSize: juicyWidBub * 0.07,
                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                    textShadowOffset: { width: 0, height: 1 },
                    textAlign: 'center',
                }}
            >
                Your Sweetest Inventions
            </ShakeTextJuicy>
            {/* juicyInventions list */}
            {juicyInventions.length === 0 ? (
                <JuicyViewShake style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <JuicyShakeImg
                        source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/noInventions.png')}
                        style={{ width: juicyWidBub * 0.97, height: juicyHighBub * 0.48, marginTop: -juicyHighBub * 0.12 }}
                        resizeMode='contain'
                    />

                    <ShakeTextJuicy
                        style={{
                            fontSize: juicyWidBub * 0.04,
                            textAlign: 'center',
                            marginTop: juicyHighBub * 0.025,
                            color: '#003F25',
                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            width: juicyWidBub * 0.9,
                            fontStyle: 'italic',
                        }}
                    >
                        Your blender is waiting! Start crafting your own fruity shakes and save them here
                    </ShakeTextJuicy>

                    <ShakeTouchJuicy
                        style={{
                            height: juicyHighBub * 0.055094,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            width: juicyWidBub * 0.885439634,
                            marginTop: juicyHighBub * 0.03,
                            borderRadius: juicyWidBub * 0.048,
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                        onPress={handleOpenCreateModal}
                    >
                        <LinearGradient
                            colors={['#62D837', '#15A906']}
                            start={{ x: 0.5, y: 0 }}
                            style={{
                                width: '100%',
                                position: 'absolute',
                                height: '100%',
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
                            + Create New Drink
                        </ShakeTextJuicy>
                    </ShakeTouchJuicy>
                </JuicyViewShake>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: juicyHighBub * 0.23 }}>
                    <JuicyViewShake style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingHorizontal: juicyWidBub * 0.03,
                        marginTop: juicyHighBub * 0.01,
                    }}>
                        {juicyInventions.map((item) => (
                            <Pressable
                                key={item.id}
                                style={{
                                    width: juicyWidBub * 0.42,
                                    margin: juicyWidBub * 0.015,
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    borderRadius: juicyWidBub * 0.055,
                                    backgroundColor: '#FFD1DF',
                                }}
                                onLongPress={() => handleDeleteInvention(item.id)}
                                // @ts-ignore
                                as={ShakeTouchJuicy}
                            >
                                <JuicyShakeImg
                                    source={item.photo ? { uri: item.photo } : require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/noInventions.png')}
                                    style={{
                                        width: juicyWidBub * 0.42,
                                        height: juicyWidBub * 0.32,
                                        borderRadius: juicyWidBub * 0.055,
                                    }}
                                    resizeMode="cover"
                                />
                                <JuicyViewShake
                                    style={{
                                        alignItems: 'center',
                                        width: juicyWidBub * 0.42,
                                        backgroundColor: '#FFD1DF',
                                        marginTop: juicyWidBub * 0.005,
                                        paddingVertical: juicyWidBub * 0.025,
                                    }}
                                >
                                    <ShakeTextJuicy
                                        style={{
                                            textAlign: 'center',
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                            color: '#D72E5F',
                                            fontSize: juicyWidBub * 0.04,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {item.name}
                                    </ShakeTextJuicy>
                                </JuicyViewShake>
                            </Pressable>
                        ))}
                    </JuicyViewShake>
                </ScrollView>
            )}

            {/* Modal for creating new drink */}
            <Modal
                onRequestClose={handleCloseModal}
                transparent
                animationType="slide"
                visible={modalVisible}
            >
                <JuicyViewShake
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <JuicyViewShake
                        style={{
                            width: juicyWidBub,
                            borderRadius: juicyWidBub * 0.08,
                            shadowOpacity: 0.1,
                            backgroundColor: '#CFFCD3',
                            padding: juicyWidBub * 0.04,
                            shadowRadius: 10,
                            shadowColor: '#000',
                            height: juicyHighBub,
                        }}
                    >
                        <SafeAreaView />
                        {/* Header */}
                        <JuicyViewShake style={{ flexDirection: 'row', alignItems: 'center', marginBottom: juicyWidBub * 0.03 }}>
                            <ShakeTouchJuicy
                                style={{
                                    justifyContent: 'center',
                                    width: juicyHighBub * 0.07,
                                    alignItems: 'center',
                                    borderRadius: juicyHighBub * 0.023,
                                    backgroundColor: '#6EC1FF',
                                    height: juicyHighBub * 0.07,
                                    marginRight: juicyWidBub * 0.019,
                                }}
                                onPress={handleCloseModal}
                            >
                                <JuicyShakeImg
                                    source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyArrowsBack.png')}
                                    style={{
                                        height: juicyHighBub * 0.035,
                                        width: juicyHighBub * 0.035,
                                    }}
                                    resizeMode='contain'
                                />
                            </ShakeTouchJuicy>

                            <ShakeTextJuicy
                                style={{
                                    color: '#FFD1DF',
                                    textShadowRadius: 3,
                                    fontStyle: 'italic',
                                    textShadowColor: '#D72E5F',
                                    marginBottom: juicyHighBub * 0.01,
                                    fontSize: juicyWidBub * 0.07,
                                    textAlign: 'center',
                                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                                    textShadowOffset: { width: 0, height: 1 },
                                }}
                            >
                                Create New Drink
                            </ShakeTextJuicy>
                        </JuicyViewShake>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Photo picker */}
                            <JuicyViewShake style={{ alignItems: 'center', marginBottom: juicyWidBub * 0.03 }}>
                                {newDrink.photo ? (
                                    <JuicyShakeImg
                                        source={{ uri: newDrink.photo }}
                                        style={{
                                            height: juicyWidBub * 0.35,
                                            width: juicyWidBub * 0.35,
                                            borderRadius: juicyWidBub * 0.04,
                                            marginBottom: juicyWidBub * 0.02,
                                        }}
                                        resizeMode="cover"
                                    />
                                ) : null}
                                <ShakeTouchJuicy
                                    style={{
                                        backgroundColor: '#FFD1DF',
                                        paddingHorizontal: juicyWidBub * 0.07,
                                        paddingVertical: juicyWidBub * 0.03,
                                        alignItems: 'center',
                                        borderRadius: juicyWidBub * 0.04,
                                    }}
                                    onPress={handlePickImage}
                                >
                                    <ShakeTextJuicy style={{ color: '#D72E5F', fontSize: juicyWidBub * 0.04 }}>
                                        {newDrink.photo ? 'Change Image' : 'Pick Image'}
                                    </ShakeTextJuicy>
                                </ShakeTouchJuicy>
                            </JuicyViewShake>
                            {/* Name input */}
                            <TextInput
                                style={{
                                    marginBottom: juicyWidBub * 0.03,
                                    borderRadius: juicyWidBub * 0.04,
                                    fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                    backgroundColor: '#FFD1DF',
                                    padding: juicyWidBub * 0.03,
                                    color: '#D72E5F',
                                }}
                                placeholder="Drink Name"
                                value={newDrink.name}
                                onChangeText={name => setNewDrink({ ...newDrink, name })}
                            />
                            {/* Ingredients */}
                            {newDrink.ingredients.map((ingredient, idx) => (
                                <JuicyViewShake key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: juicyWidBub * 0.02 }}>
                                    <TextInput
                                        style={{
                                            color: '#D72E5F',
                                            backgroundColor: '#FFD1DF',
                                            padding: juicyWidBub * 0.03,
                                            flex: 1,
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                            borderRadius: juicyWidBub * 0.04,
                                        }}
                                        placeholder="Ingredient"
                                        value={ingredient}
                                        onChangeText={text => handleIngredientChange(text, idx)}
                                    />
                                    {newDrink.ingredients.length > 1 && (
                                        <ShakeTouchJuicy onPress={() => handleRemoveIngredient(idx)}>
                                            <ShakeTextJuicy style={{ color: '#D72E5F', fontSize: juicyWidBub * 0.07, marginLeft: juicyWidBub * 0.01 }}>✕</ShakeTextJuicy>
                                        </ShakeTouchJuicy>
                                    )}
                                </JuicyViewShake>
                            ))}
                            <ShakeTouchJuicy
                                style={{
                                    marginBottom: juicyWidBub * 0.03,
                                    alignItems: 'center',
                                    borderRadius: juicyWidBub * 0.04,
                                    paddingVertical: juicyWidBub * 0.03,
                                    backgroundColor: '#D72E5F',
                                }}
                                onPress={handleAddIngredient}
                            >
                                <ShakeTextJuicy style={{ color: '#FFF', fontSize: juicyWidBub * 0.04 }}>
                                    + Add Ingredient
                                </ShakeTextJuicy>
                            </ShakeTouchJuicy>
                            {/* Steps */}
                            {newDrink.steps.map((step, idx) => (
                                <JuicyViewShake key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: juicyWidBub * 0.02 }}>
                                    <TextInput
                                        style={{
                                            color: '#D72E5F',
                                            backgroundColor: '#FFD1DF',
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                            borderRadius: juicyWidBub * 0.04,
                                            padding: juicyWidBub * 0.03,
                                            flex: 1,
                                        }}
                                        placeholder="Step"
                                        value={step}
                                        onChangeText={text => handleStepChange(text, idx)}
                                    />
                                    {newDrink.steps.length > 1 && (
                                        <ShakeTouchJuicy onPress={() => handleRemoveStep(idx)}>
                                            <ShakeTextJuicy style={{ color: '#D72E5F', fontSize: juicyWidBub * 0.07, marginLeft: juicyWidBub * 0.01 }}>✕</ShakeTextJuicy>
                                        </ShakeTouchJuicy>
                                    )}
                                </JuicyViewShake>
                            ))}
                            <ShakeTouchJuicy
                                style={{
                                    alignItems: 'center',
                                    backgroundColor: '#D72E5F',
                                    marginBottom: juicyWidBub * 0.03,
                                    paddingVertical: juicyWidBub * 0.03,
                                    borderRadius: juicyWidBub * 0.04,
                                }}
                                onPress={handleAddStep}
                            >
                                <ShakeTextJuicy style={{ color: '#FFF', fontSize: juicyWidBub * 0.04 }}>
                                    + Add Step
                                </ShakeTextJuicy>
                            </ShakeTouchJuicy>
                            {/* Save button */}
                            <ShakeTouchJuicy
                                style={{
                                    justifyContent: 'center',
                                    borderRadius: juicyWidBub * 0.04,
                                    height: juicyHighBub * 0.055094,
                                    alignItems: 'center',
                                    opacity: isOpacity ? 1 : 0.5,
                                    marginBottom: juicyWidBub * 0.01,
                                    overflow: 'hidden',
                                    backgroundColor: '#62D837',
                                }}
                                onPress={handleSaveDrink}
                                disabled={!isOpacity}
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
                                <ShakeTextJuicy style={{ color: '#FFF', fontSize: juicyWidBub * 0.04 }}>
                                    Save
                                </ShakeTextJuicy>
                            </ShakeTouchJuicy>
                        </ScrollView>
                    </JuicyViewShake>
                </JuicyViewShake>
            </Modal>

            <JuicyAnimatedAlert
                visible={showDeleteModal}
                text="Shake deleted successfully!"
                onHide={() => setShowDeleteModal(false)}
            />

            {juicyInventions.length > 0 && (
                <ShakeTouchJuicy
                    style={{
                        right: juicyWidBub * 0.08,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: juicyHighBub * 0.131,
                        height: juicyHighBub * 0.055094,
                        borderRadius: juicyWidBub * 0.048,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: juicyWidBub * 0.50212,
                    }}
                    onPress={handleOpenCreateModal}
                >
                    <LinearGradient
                        style={{
                            width: '100%',
                            position: 'absolute',
                            height: '100%',
                        }}
                        colors={['#62D837', '#15A906']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                    <ShakeTextJuicy
                        style={{
                            fontSize: juicyWidBub * 0.04,
                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            color: '#FFF',
                        }}
                    >
                        + Create New Drink
                    </ShakeTextJuicy>
                </ShakeTouchJuicy>
            )}
        </JuicyViewShake>
    );
};

export default ShakeBubbleJuicyInventions;