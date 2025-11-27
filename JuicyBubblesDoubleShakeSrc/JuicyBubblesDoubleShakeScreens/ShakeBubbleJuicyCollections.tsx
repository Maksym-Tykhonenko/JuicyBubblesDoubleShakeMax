import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useState } from 'react';
import { juicyFonts } from '../juicyFonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SafeAreaView as JuicyShakeAreSafe,
    View as JuicyShakeView,
    Text as ShakeTextJuicy,
    Dimensions as JuicyShakeScreenSizes,
    TouchableOpacity as DoubleJuicyTouch,
    Image as JuicyShakeImg,
    Alert,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShakeCardsGrid from './ShakeCardsGrid';
import { ScrollView } from 'react-native-gesture-handler';
import JuicyAnimatedAlert from './JuicyAnimatedAlert';

const juicyEmojis = [
    '⭐', '🍓', '🍋', '🍉', '🍊', '🫐', '🍌', '🍒', '🥝', '🍍', '🍏', '🍈', '🍑', '🍇', '🥭', '❤️',
    '💙', '💚', '💛', '🧡', '💜', '🤎', '🖤', '🤍', '✨', '🌟', '🌈', '🍭', '🍬', '🍫', '🍪', '🍩',
    '🍦', '🍧', '🍨', '🧁', '🥧', '🍰', '🎂', '🥮', '🍯', '🥤', '🧃', '🧋', '🍵', '☕', '🫖', '🥛',
    '🧊', '🍸', '🍹', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🧉', '🍾', '🍽️', '🥄', '🍴', '🧂', '🥢',
    '🍔', '🍟', '🌭', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🍲', '🍜', '🍝', '🍠', '🥔',
    '🥕', '🌽', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥚', '🧀', '🥓', '🥩', '🍗', '🍖', '🦴', '🥨',
    '🥞', '🧇', '🍞', '🥐', '🥯', '🥖', '🫓', '🍙', '🍚', '🍛', '🍤', '🍣', '🍱', '🥟', '🍢', '🍡',
    '🍧', '🍦', '🍨', '🍩', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '🧃', '🥤', '🧋', '🍵',
    '☕', '🫖', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🍾', '🥃', '🧉', '🍽️', '🥄', '🍴', '🥢', '🧂',
    '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '🌱', '🌿', '🍀', '🍁', '🍂', '🍃', '🌵', '🎋', '🎍',
    '🌾', '🌳', '🌲', '🌴', '🪴', '🌰', '🍄', '🌎', '🌍', '🌏', '🪐', '🌙', '🌚', '🌝', '🌞', '⭐',
    '🌟', '💫', '✨', '⚡', '🔥', '💥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️',
    '❄️', '☃️', '⛄', '🌬️', '💨', '🌀', '🌊', '💧', '💦', '☔', '🌫️', '🌁', '🌆', '🌇', '🏙️', '🌃',
    '🌌', '🌉', '🌁', '🌄', '🌅', '🌠', '🎇', '🎆', '🧨', '✨', '🎉', '🎊', '🎈', '🎂', '🍰', '🧁',
    '🍦', '🍧', '🍨', '🍩', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '🧃', '🥤', '🧋', '🍵',
    '☕', '🫖', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🍾', '🥃', '🧉', '🍽️', '🥄', '🍴', '🥢', '🧂'
];

const ShakeBubbleJuicyCollections: React.FC = () => {
    const { width: juicyWidBub, height: juicyHighBub } = JuicyShakeScreenSizes.get('window');
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionEmoji, setNewCollectionEmoji] = useState('⭐');
    const [selectedCollectionIdx, setSelectedCollectionIdx] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Завантаження колекцій з AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem('juicyBubbleShakesCollection').then(res => {
            if (res) {
                try {
                    const arr = JSON.parse(res);
                    setCollections(Array.isArray(arr) ? arr : []);
                } catch {
                    setCollections([]);
                }
            } else {
                setCollections([]);
            }
        });
    }, [addModalVisible]);

    // Helper to get unused emoji
    const getRandomUnusedEmoji = () => {
        const usedEmojis = collections.map(c => c.juicyLogoEmodji);
        const unused = juicyEmojis.filter(e => !usedEmojis.includes(e));
        if (unused.length === 0) return juicyEmojis[Math.floor(Math.random() * juicyEmojis.length)];
        return unused[Math.floor(Math.random() * unused.length)];
    };

    // Open create modal and pick emoji
    const handleOpenCreateModal = () => {
        setNewCollectionName('');
        setNewCollectionEmoji(getRandomUnusedEmoji());
        setCreateModalVisible(true);
    };

    // Create collection logic
    const handleCreateCollection = async () => {
        const name = newCollectionName.trim();
        if (!name) return;
        const newObj = {
            juicyCollectionId: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(),
            juicyCollectionName: name,
            juicyLogoEmodji: newCollectionEmoji,
            juicyCollectionObjects: []
        };
        const updated = [...collections, newObj];
        setCollections(updated);
        await AsyncStorage.setItem('juicyBubbleShakesCollection', JSON.stringify(updated));
        setCreateModalVisible(false);
    };

    return (
        <JuicyShakeView style={{ flex: 1 }}>
            <JuicyShakeAreSafe />
            {/* Header */}
            {selectedCollectionIdx === null ? (
                <>
                    <ShakeTextJuicy
                        style={{
                            marginBottom: juicyHighBub * 0.01,
                            textShadowRadius: 3,
                            fontStyle: 'italic',
                            color: '#FFD1DF',
                            fontSize: juicyWidBub * 0.07,
                            textAlign: 'center',
                            fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                            textShadowColor: '#D72E5F',
                            textShadowOffset: { width: 0, height: 1 },
                        }}
                    >
                        My Bubble Collections
                    </ShakeTextJuicy>
                    {/* Collections list */}
                    {collections.length === 0 && (
                        <JuicyShakeView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <JuicyShakeImg
                                source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/noCoctailsHereYet.png')}
                                style={{ width: juicyWidBub * 0.97, height: juicyHighBub * 0.48, marginTop: -juicyHighBub * 0.12 }}
                                resizeMode='contain'
                            />

                            <ShakeTextJuicy
                                style={{
                                    fontSize: juicyWidBub * 0.04,
                                    color: '#003F25',
                                    fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                    textAlign: 'center',
                                    width: juicyWidBub * 0.9,
                                    fontStyle: 'italic',
                                    marginTop: juicyHighBub * 0.025,
                                }}
                            >
                                No collections here yet. Start adding your favorite mixes and sweet inventions to bring this collection to life!
                            </ShakeTextJuicy>
                        </JuicyShakeView>
                    )}

                    <JuicyShakeView style={{ paddingHorizontal: juicyWidBub * 0.05 }}>
                        {collections.map((col, idx) => (
                            <DoubleJuicyTouch
                                activeOpacity={0.845235435}
                                key={idx}
                                style={{
                                    backgroundColor: '#FFD1DF',
                                    borderRadius: 24,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: juicyHighBub * 0.025,
                                    padding: juicyWidBub * 0.04,
                                }}
                                onPress={() => setSelectedCollectionIdx(idx)}
                                onLongPress={() => {
                                    Alert.alert(
                                        'Delete Collection',
                                        `Are you sure you want to delete "${col.juicyCollectionName}"? All saved cocktails inside will remain in your recipes but will no longer be part of this collection`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Delete',
                                                style: 'destructive',
                                                onPress: () => {
                                                    const updatedCollections = collections.filter((_, i) => i !== idx);
                                                    setCollections(updatedCollections);
                                                    AsyncStorage.setItem('juicyBubbleShakesCollection', JSON.stringify(updatedCollections));
                                                    setShowDeleteModal(true);
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <JuicyShakeView>
                                    <ShakeTextJuicy
                                        style={{
                                            fontSize: juicyWidBub * 0.055,
                                            color: '#D72E5F',
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                            marginBottom: juicyHighBub * 0.01,
                                        }}
                                    >
                                        {col.juicyCollectionName}
                                    </ShakeTextJuicy>
                                    <ShakeTextJuicy
                                        style={{
                                            fontSize: juicyWidBub * 0.035,
                                            color: '#D72E5F',
                                            opacity: 0.6,
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        }}
                                    >
                                        {col.juicyCollectionObjects?.length ?? 0} drink{col.juicyCollectionObjects?.length === 1 ? '' : 's'} inside
                                    </ShakeTextJuicy>
                                </JuicyShakeView>
                                <JuicyShakeView
                                    style={{
                                        backgroundColor: '#D72E5F',
                                        borderRadius: 16,
                                        width: juicyWidBub * 0.14,
                                        height: juicyWidBub * 0.14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ShakeTextJuicy style={{ fontSize: juicyWidBub * 0.059 }}>
                                        {col.juicyLogoEmodji}
                                    </ShakeTextJuicy>
                                </JuicyShakeView>
                            </DoubleJuicyTouch>
                        ))}
                    </JuicyShakeView>
                    {/* Create Collection Button */}
                    <DoubleJuicyTouch
                        style={{
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: juicyHighBub * 0.131,
                            width: juicyWidBub * 0.50212,
                            borderRadius: juicyWidBub * 0.048,
                            height: juicyHighBub * 0.055094,
                            right: juicyWidBub * 0.08,
                            alignItems: 'center',
                        }}
                        onPress={handleOpenCreateModal}
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
                            + Create Collection
                        </ShakeTextJuicy>
                    </DoubleJuicyTouch>
                </>
            ) : (
                // Collection details view
                <JuicyShakeView style={{ flex: 1 }}>
                    {/* Header with back arrow, name, emoji */}
                    <JuicyShakeView style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: juicyHighBub * 0.03,
                        marginBottom: juicyHighBub * 0.01,
                        paddingHorizontal: juicyWidBub * 0.05,
                    }}>
                        <DoubleJuicyTouch
                            style={{
                                borderRadius: juicyHighBub * 0.023,
                                width: juicyHighBub * 0.07,
                                alignItems: 'center',
                                height: juicyHighBub * 0.07,
                                justifyContent: 'center',
                                backgroundColor: '#6EC1FF',
                            }}
                            onPress={() => setSelectedCollectionIdx(null)}
                        >
                            <JuicyShakeImg
                                source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyArrowsBack.png')}
                                style={{
                                    height: juicyHighBub * 0.035,
                                    width: juicyHighBub * 0.035,
                                }}
                                resizeMode='contain'
                            />
                        </DoubleJuicyTouch>
                        <ShakeTextJuicy
                            style={{
                                fontSize: juicyWidBub * 0.07,
                                fontStyle: 'italic',
                                color: '#FFD1DF',
                                textShadowRadius: 3,
                                textAlign: 'center',
                                fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                                textShadowColor: '#D72E5F',
                                textShadowOffset: { width: 0, height: 1 },
                                flex: 1,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {collections[selectedCollectionIdx]?.juicyCollectionName}
                        </ShakeTextJuicy>
                        <JuicyShakeView
                            style={{
                                backgroundColor: '#FFD1DF',
                                borderRadius: 16,
                                width: juicyWidBub * 0.14,
                                height: juicyWidBub * 0.14,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: juicyWidBub * 0.02,
                            }}
                        >
                            <ShakeTextJuicy style={{ fontSize: juicyWidBub * 0.059 }}>
                                {collections[selectedCollectionIdx]?.juicyLogoEmodji}
                            </ShakeTextJuicy>
                        </JuicyShakeView>
                    </JuicyShakeView>
                    {/* Shakes grid */}
                    <JuicyShakeView style={{ flex: 1 }}>
                        {collections[selectedCollectionIdx]?.juicyCollectionObjects.length === 0 && (
                            <JuicyShakeView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <JuicyShakeImg
                                    source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/noCoctailsHereYet.png')}
                                    style={{ width: juicyWidBub * 0.97, height: juicyHighBub * 0.48, marginTop: juicyHighBub * 0.31 }}
                                    resizeMode='contain'
                                />

                                <ShakeTextJuicy
                                    style={{
                                        fontSize: juicyWidBub * 0.04,
                                        color: '#003F25',
                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        textAlign: 'center',
                                        width: juicyWidBub * 0.9,
                                        fontStyle: 'italic',
                                        marginTop: juicyHighBub * 0.025,
                                    }}
                                >
                                    No cocktails here yet. Start adding your favorite mixes and sweet inventions to bring this collection to life!
                                </ShakeTextJuicy>
                            </JuicyShakeView>
                        )}
                        <ScrollView contentContainerStyle={{ paddingBottom: juicyHighBub * 0.15 }} showsVerticalScrollIndicator={false}>
                            <ShakeCardsGrid
                                shakes={collections[selectedCollectionIdx]?.juicyCollectionObjects ?? []}
                                onCardLongPress={(shake) => {
                                    Alert.alert(
                                        'Remove Shake',
                                        `Remove "${shake.name}" from this collection?`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Remove',
                                                style: 'destructive',
                                                onPress: async () => {
                                                    const updatedCollections = [...collections];
                                                    const col = updatedCollections[selectedCollectionIdx];
                                                    col.juicyCollectionObjects = col.juicyCollectionObjects.filter((obj: any) => obj.name !== shake.name);
                                                    setCollections(updatedCollections);
                                                    await AsyncStorage.setItem('juicyBubbleShakesCollection', JSON.stringify(updatedCollections));
                                                }
                                            }
                                        ]
                                    );
                                }}
                            />
                        </ScrollView>
                    </JuicyShakeView>
                </JuicyShakeView>
            )}
            {/* Create Collection Modal */}
            {createModalVisible && (
                <JuicyShakeView style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: juicyWidBub,
                    height: juicyHighBub,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                    backgroundColor: 'rgba(0,0,0,0.08)',
                }}>
                    <BlurView
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: juicyWidBub,
                            height: juicyHighBub,
                        }}
                        blurType="light"
                        blurAmount={2}
                    />
                    <JuicyShakeView style={{
                        width: juicyWidBub * 0.85,
                        borderRadius: juicyWidBub * 0.07,
                        backgroundColor: '#6EECA6',
                        padding: juicyWidBub * 0.06,
                        alignItems: 'center',
                        shadowColor: '#3AE19C',
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                    }}>
                        {/* Header */}
                        <JuicyShakeView style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: juicyWidBub * 0.04 }}>
                            <ShakeTextJuicy style={{
                                fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                                fontSize: juicyWidBub * 0.06,
                                color: '#003F25',
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                            }}>
                                Create Collection
                            </ShakeTextJuicy>
                            <DoubleJuicyTouch
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#003F25',
                                    borderRadius: juicyWidBub * 0.1,
                                    width: juicyWidBub * 0.09,
                                    height: juicyWidBub * 0.09,
                                    marginLeft: juicyWidBub * 0.02,
                                }}
                                onPress={() => setCreateModalVisible(false)}
                            >
                                <ShakeTextJuicy style={{
                                    fontSize: juicyWidBub * 0.06,
                                    color: '#fff',
                                }}>×</ShakeTextJuicy>
                            </DoubleJuicyTouch>
                        </JuicyShakeView>
                        {/* Emoji */}
                        <JuicyShakeView style={{
                            backgroundColor: '#D72E5F',
                            borderRadius: juicyWidBub * 0.06,
                            width: juicyWidBub * 0.18,
                            height: juicyWidBub * 0.18,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: juicyWidBub * 0.04,
                        }}>
                            <ShakeTextJuicy style={{ fontSize: juicyWidBub * 0.09 }}>
                                {newCollectionEmoji}
                            </ShakeTextJuicy>
                        </JuicyShakeView>
                        {/* Name input */}
                        <TextInput
                            style={{
                                width: '100%',
                                backgroundColor: '#D9FFD9',
                                borderRadius: juicyWidBub * 0.04,
                                fontSize: juicyWidBub * 0.045,
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                paddingHorizontal: juicyWidBub * 0.04,
                                paddingVertical: juicyWidBub * 0.025,
                                marginBottom: juicyWidBub * 0.06,
                                color: '#003F25',
                                textAlign: 'left',
                            }}
                            placeholder="Collection Name"
                            placeholderTextColor="#003f258a"
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            maxLength={32}
                        />
                        {/* Create button */}
                        <DoubleJuicyTouch
                            style={{
                                width: '100%',
                                borderRadius: juicyWidBub * 0.04,
                                height: juicyHighBub * 0.061,
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                            }}
                            onPress={handleCreateCollection}
                            disabled={!newCollectionName.trim()}
                        >
                            <LinearGradient
                                colors={['#62D837', '#15A906']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            <ShakeTextJuicy style={{
                                fontSize: juicyWidBub * 0.04,
                                color: '#fff',
                                fontWeight: 'bold',
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            }}>
                                Create
                            </ShakeTextJuicy>
                        </DoubleJuicyTouch>
                    </JuicyShakeView>
                </JuicyShakeView>
            )}
            <JuicyAnimatedAlert
                visible={showDeleteModal}
                text="Collection deleted successfully!"
                onHide={() => setShowDeleteModal(false)}
            />
        </JuicyShakeView>
    );
};

export default ShakeBubbleJuicyCollections;