import { Picker } from '@react-native-picker/picker';
import juicyShakes from '../JuicyBubblesDataDoubleShake/juicyShakes';
import { juicyFonts } from '../juicyFonts';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Alert,
    TouchableOpacity,
    Animated,
    SafeAreaView as JuicyShakeAreSafe,
    Modal,
    Share,
    Pressable,
    Image as JuicyShakeImge,
    Text,
    View as JuicyShakeView,
    Dimensions as JuicyShakeScreenSizes,
    Platform,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import ShakeCardsGrid from './ShakeCardsGrid';

const juicyCategories = [
    { title: 'Strawberry', emoji: '🍓', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Strawberry.png') },
    { title: 'Banana', emoji: '🍌', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Banana.png') },
    { title: 'Blueberry', emoji: '🫐', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Blueberry.png') },
    { title: 'Watermelon', emoji: '🍉', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Watermelon.png') },
    { title: 'Lemon', emoji: '🍋', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Lemon.png') },
    { title: 'Orange', emoji: '🍊', juicyCatImg: require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/Orange.png') },
]

const BubbleShakeJuicyMain: React.FC = () => {
    const { width: juicyWidBub, height: juicyHighBub } = JuicyShakeScreenSizes.get('window');
    const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<string>('');
    const [selectedShake, setSelectedShake] = useState<any>(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [alreadyInCollections, setAlreadyInCollections] = useState<string[]>([]);
    const [selectedCat, setSelectedCat] = useState<string>('All');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addModalText, setAddModalText] = useState('');

    // Фільтрація шейків
    const filteredShakes = selectedCat === 'All'
        ? juicyShakes
        : juicyShakes.filter(shake => shake.category === selectedCat);

    // Функція для отримання картинки по категорії
    const getCategoryImg = (cat: string) => {
        const found = juicyCategories.find(c => c.title === cat);
        return found ? found.juicyCatImg : null;
    };

    // Оновлення чекбоксів інгредієнтів
    const toggleIngredient = (idx: number) => {
        setCheckedIngredients(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx)
                : [...prev, idx]
        );
    };

    // Відкриття модалки
    const openModal = (shake: any) => {
        setSelectedShake(shake);
        setCheckedIngredients([]);
        setModalVisible(true);
    };

    // Закриття модалки
    const closeModal = () => {
        setModalVisible(false);
        setSelectedShake(null);
        setCheckedIngredients([]);
    };

    // Функція поширення рецепту
    const handleShare = () => {
        if (!selectedShake) return;
        const text =
            `I found a delicious shake recipe in Juicy Bubbles: Double Shake app: ` +
            `${selectedShake.name}\n\n` +
            `Ingredients:\n${selectedShake.ingredients.map((i: string) => `• ${i}`).join('\n')}\n\n` +
            `Steps:\n${selectedShake.steps.map((s: string, idx: number) => `${idx + 1}. ${s}`).join('\n')}\n\n` +
            `Tags: ${selectedShake.tags.join(' ')}`;
        Share.share({ message: text });
    };

    // Завантаження колекцій з AsyncStorage
    useEffect(() => {
        if (addModalVisible && selectedShake) {
            AsyncStorage.getItem('juicyBubbleShakesCollection').then(res => {
                let arr = [];
                if (res) {
                    try {
                        arr = JSON.parse(res);
                    } catch {
                        arr = [];
                    }
                }
                setCollections(Array.isArray(arr) ? arr : []);
                setSelectedCollection(Array.isArray(arr) && arr.length > 0 ? arr[0].juicyCollectionName : '');
                // Перевіряємо в яких колекціях вже є цей shake
                const inCollections = arr
                    .filter((col: any) =>
                        Array.isArray(col.juicyCollectionObjects) &&
                        col.juicyCollectionObjects.some((obj: any) => obj.name === selectedShake.name)
                    )
                    .map((col: any) => col.juicyCollectionName);
                setAlreadyInCollections(inCollections);
            });
        }



        // AsyncStorage.clear()

        // Додаємо дефолтну колекцію якщо juicyBubbleShakesCollection порожній

        AsyncStorage.getItem('juicyBubbleShakesCollection').then(res => {
            let collectionsArr = [];
            if (res) {
                try {
                    collectionsArr = JSON.parse(res);
                } catch {
                    collectionsArr = [];
                }
            }
            if (!Array.isArray(collectionsArr) || collectionsArr.length === 0) {
                const defaultObj = {
                    juicyCollectionId: Date.now().toString() + Math.floor(Math.random() * 1000000).toString(), // add unique id
                    juicyCollectionName: 'Favorite Sips',
                    juicyLogoEmodji: '❤️',
                    juicyCollectionObjects: []
                };
                AsyncStorage.setItem('juicyBubbleShakesCollection', JSON.stringify([defaultObj]));
            }
        });
    }, [addModalVisible, selectedShake]);

    // Додавання shake до колекції
    const handleAddToCollection = async () => {
        if (!selectedShake || !selectedCollection) return;
        if (alreadyInCollections.includes(selectedCollection)) {
            Alert.alert('Error', 'This shake is already in the selected collection.');
            return;
        }
        const res = await AsyncStorage.getItem('juicyBubbleShakesCollection');
        let arr = [];
        if (res) {
            try {
                arr = JSON.parse(res);
            } catch {
                arr = [];
            }
        }
        const idx = arr.findIndex((col: any) => col.juicyCollectionName === selectedCollection);
        if (idx !== -1) {
            arr[idx].juicyCollectionObjects.push(selectedShake);
            await AsyncStorage.setItem('juicyBubbleShakesCollection', JSON.stringify(arr));
            setAddModalVisible(false);
            setAddModalText(`"${selectedShake.name}" added to "${selectedCollection}"`);
            setTimeout(() => {
                setShowAddModal(true);
            }, 300);
            setTimeout(() => setShowAddModal(false), 2500);
        }
    };

    return (
        <JuicyShakeView style={{ flex: 1 }}>
            <JuicyShakeAreSafe />
            <Text
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
                Pick Your Perfect Mix
            </Text>
            <TouchableOpacity
                style={{
                    zIndex: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: juicyHighBub * 0.131,
                    justifyContent: 'center',
                    borderRadius: juicyWidBub * 0.048,
                    height: juicyHighBub * 0.055094,
                    right: juicyWidBub * 0.08,
                    width: juicyWidBub * 0.50212,
                }}
                onPress={() => {
                    setSelectedShake(juicyShakes[Math.floor(Math.random() * juicyShakes.length)]);
                    setModalVisible(true);
                }}
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
                <Text
                    style={{
                        fontSize: juicyWidBub * 0.037,
                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                        color: '#FFF',
                    }}
                >
                    ✨ Shake Up a Surprise!
                </Text>
            </TouchableOpacity>
            {/* Категорії */}
            <JuicyShakeView style={{
                marginBottom: juicyHighBub * 0.015,
                marginTop: juicyHighBub * 0.03,
                justifyContent: 'center',
                flexDirection: 'row',
            }}>
                <JuicyShakeView
                    style={{
                        marginHorizontal: juicyWidBub * 0.01,
                        height: juicyWidBub * 0.12,
                        borderRadius: juicyWidBub * 0.04,
                        backgroundColor: selectedCat === 'All' ? '#FC93AA' : '#3AE19C',
                        width: juicyWidBub * 0.12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: juicyWidBub * 0.02,
                    }}
                    onTouchEnd={() => setSelectedCat('All')}
                >
                    <Animated.Text
                        style={{
                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            fontSize: juicyWidBub * 0.045,
                            color: 'white',
                        }}
                    >
                        All
                    </Animated.Text>
                </JuicyShakeView>
                {juicyCategories.map(cat => (
                    <JuicyShakeView
                        key={cat.title}
                        style={{
                            marginHorizontal: juicyWidBub * 0.01,
                            alignItems: 'center',
                            width: juicyWidBub * 0.12,
                            justifyContent: 'center',
                            height: juicyWidBub * 0.12,
                            backgroundColor: selectedCat === cat.title ? '#FC93AA' : '#3AE19C',
                            borderRadius: juicyWidBub * 0.04,
                        }}
                        onTouchEnd={() => setSelectedCat(cat.title)}
                    >
                        <Animated.Text
                            style={{
                                color: '#FF5A8A',
                                fontSize: juicyWidBub * 0.045,
                                textAlign: 'center',
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            }}
                        >
                            {cat.emoji}
                        </Animated.Text>
                    </JuicyShakeView>
                ))}
            </JuicyShakeView>

            {/* Заголовок */}
            <Text
                style={{
                    fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                    textShadowColor: '#D72E5F',
                    textShadowOffset: { width: 0, height: 1 },
                    fontStyle: 'italic',
                    color: '#FFD1DF',
                    textShadowRadius: 3,
                    textAlign: 'center',
                    marginBottom: juicyHighBub * 0.01,
                    fontSize: juicyWidBub * 0.07,
                }}
            >
                Juicy Bubbles Selection
            </Text>
            <ScrollView contentContainerStyle={{ paddingBottom: juicyHighBub * 0.1245653452 + juicyHighBub * 0.1 }} showsVerticalScrollIndicator={false}>
                {/* Список шейків */}
                <ShakeCardsGrid
                    shakes={filteredShakes}
                    onCardPress={openModal}
                />
            </ScrollView>
            {/* Модалка з деталями шейку */}
            <Modal
                onRequestClose={closeModal}
                transparent={true}
                animationType="slide"
                visible={modalVisible}
            >
                <JuicyShakeView style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(217,255,217,0.98)',
                    padding: juicyWidBub * 0.04,
                    justifyContent: 'center',
                    flex: 1,
                    paddingTop: Platform.OS === 'android' ? -juicyHighBub * 0.0405345 : 0
                }}>
                    <JuicyShakeView style={{
                        backgroundColor: '#D9FFD9',
                        height: '100%',
                        borderRadius: juicyWidBub * 0.07,
                        width: juicyWidBub,
                        alignSelf: 'center',
                        padding: juicyWidBub * 0.04,
                        alignItems: 'center',
                        position: 'relative',
                    }}>
                        <JuicyShakeAreSafe />
                        {/* Кнопки закриття та Add to Collection */}
                        <JuicyShakeView style={{
                            marginBottom: juicyWidBub * 0.02,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <TouchableOpacity
                                style={{
                                    borderRadius: juicyHighBub * 0.023,
                                    width: juicyHighBub * 0.07,
                                    alignItems: 'center',
                                    height: juicyHighBub * 0.07,
                                    justifyContent: 'center',
                                    backgroundColor: '#6EC1FF',
                                }}
                                onPress={closeModal}
                            >
                                <JuicyShakeImge
                                    source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyArrowsBack.png')}
                                    style={{
                                        height: juicyHighBub * 0.035,
                                        width: juicyHighBub * 0.035,
                                    }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: juicyWidBub * 0.5,
                                    backgroundColor: '#3AE19C',
                                    borderRadius: juicyWidBub * 0.04,
                                    overflow: 'hidden',
                                    height: juicyHighBub * 0.061,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => setAddModalVisible(true)}
                            >
                                <LinearGradient
                                    colors={['#62D837', '#15A906']}
                                    start={{ x: 0.5, y: 0 }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    end={{ x: 0.5, y: 1 }}
                                />
                                <Text style={{
                                    fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                    fontSize: juicyWidBub * 0.04,
                                    color: '#fff',
                                    fontWeight: 'bold',
                                }}>
                                    + Add to Collection
                                </Text>
                            </TouchableOpacity>
                        </JuicyShakeView>
                        {/* Зображення */}
                        <JuicyShakeView style={{
                            width: '100%',
                            marginBottom: juicyWidBub * 0.04,
                            marginTop: juicyWidBub * 0.13,
                            alignItems: 'center',
                        }}>
                            <JuicyShakeView style={{
                                padding: juicyWidBub * 0.04,
                                backgroundColor: '#FFD1DF',
                                width: juicyWidBub * 0.7,
                                alignItems: 'center',
                                borderRadius: juicyWidBub * 0.07,
                            }}>
                                <JuicyShakeImge
                                    style={{ width: juicyWidBub * 0.45, height: juicyWidBub * 0.45 }}
                                    resizeMode="contain"
                                    source={selectedShake ? getCategoryImg(selectedShake.category) : null}
                                />
                            </JuicyShakeView>
                        </JuicyShakeView>
                        {/* Назва та теги */}
                        <Text
                            style={{
                                marginBottom: juicyWidBub * 0.01,
                                fontSize: juicyWidBub * 0.055,
                                textAlign: 'center',
                                color: '#D72E5F',
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            }}
                        >
                            {selectedShake?.name}
                        </Text>
                        <JuicyShakeView style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: juicyWidBub * 0.03 }}>
                            {selectedShake?.tags.map((tag: string) => (
                                <JuicyShakeView
                                    key={tag}
                                    style={{
                                        backgroundColor: '#3AE19C',
                                        borderRadius: juicyWidBub * 0.03,
                                        paddingVertical: juicyWidBub * 0.005,
                                        margin: juicyWidBub * 0.005,
                                        paddingHorizontal: juicyWidBub * 0.02,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                            fontSize: juicyWidBub * 0.037,
                                            color: 'white',
                                        }}
                                    >
                                        {tag}
                                    </Text>
                                </JuicyShakeView>
                            ))}
                        </JuicyShakeView>
                        {/* Інгредієнти */}
                        <JuicyShakeView style={{ width: '100%', marginBottom: juicyWidBub * 0.02 }}>
                            <Text style={{
                                color: '#003F25',
                                marginBottom: juicyWidBub * 0.01,
                                fontSize: juicyWidBub * 0.04,
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                            }}>
                                Ingredients:
                            </Text>
                            {selectedShake?.ingredients.map((ing: string, idx: number) => (
                                <TouchableOpacity
                                    key={ing}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: juicyWidBub * 0.012,
                                    }}
                                    onPress={() => toggleIngredient(idx)}
                                >
                                    <JuicyShakeView style={{
                                        borderRadius: juicyWidBub * 0.015,
                                        height: juicyWidBub * 0.06,
                                        alignItems: 'center',
                                        width: juicyWidBub * 0.06,
                                        borderWidth: 2,
                                        borderColor: checkedIngredients.includes(idx) ? '#D72E5F' : '#222',
                                        marginRight: juicyWidBub * 0.02,
                                        justifyContent: 'center',
                                        backgroundColor: 'transparent',
                                    }}>
                                        {checkedIngredients.includes(idx) && (
                                            <Text style={{
                                                fontSize: juicyWidBub * 0.045,
                                                color: '#D72E5F',
                                                fontWeight: 'bold',
                                            }}>✓</Text>
                                        )}
                                    </JuicyShakeView>
                                    <Text style={{
                                        textDecorationLine: checkedIngredients.includes(idx) ? 'line-through' : 'none',
                                        color: checkedIngredients.includes(idx) ? '#D72E5F' : '#222',
                                        fontSize: juicyWidBub * 0.035,
                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                    }}>
                                        {ing}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </JuicyShakeView>
                        {/* Steps */}
                        <JuicyShakeView style={{ width: '100%', marginBottom: juicyWidBub * 0.02 }}>
                            <Text style={{
                                fontSize: juicyWidBub * 0.04,
                                marginBottom: juicyWidBub * 0.01,
                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                color: '#003F25',
                            }}>
                                Steps:
                            </Text>
                            {selectedShake?.steps.map((step: string, idx: number) => (
                                <JuicyShakeView key={step} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: juicyWidBub * 0.012 }}>
                                    <Text style={{
                                        fontSize: juicyWidBub * 0.04,
                                        marginRight: juicyWidBub * 0.02,
                                        color: '#003F25',
                                    }}>•</Text>
                                    <Text style={{
                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        fontSize: juicyWidBub * 0.035,
                                        color: '#003F25',
                                        flex: 1,
                                        fontWeight: 'regular',
                                    }}>
                                        {step}
                                    </Text>
                                </JuicyShakeView>
                            ))}
                        </JuicyShakeView>
                        {/* Кнопка share */}
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                right: juicyWidBub * 0.05,
                                position: 'absolute',
                                bottom: juicyWidBub * 0.1,
                                backgroundColor: '#3AE19C',
                                width: juicyHighBub * 0.075,
                                height: juicyHighBub * 0.075,
                                alignItems: 'center',
                                borderRadius: juicyHighBub * 0.023,
                            }}
                            onPress={handleShare}
                        >
                            <JuicyShakeImge
                                source={require('../JuicyBubblesDoubleShakeAssets/JuicyBubblesDoubleShakeImages/juicyBubbleShare.png')}
                                style={{
                                    width: juicyHighBub * 0.046,
                                    height: juicyHighBub * 0.046,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>

                        {/* Custom animated alert overlay */}
                        {showAddModal && (
                            <JuicyShakeView style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: juicyWidBub,
                                height: juicyHighBub,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 9999,
                                backgroundColor: 'rgba(0,0,0,0.18)',
                            }}>
                                <Animated.View style={{
                                    opacity: 1,
                                    shadowRadius: 12,
                                    backgroundColor: '#fff',
                                    borderRadius: 18,
                                    paddingHorizontal: juicyWidBub * 0.09,
                                    paddingVertical: juicyHighBub * 0.03,
                                    shadowColor: '#000',
                                    width: juicyWidBub * 0.9153450,
                                    shadowOpacity: 0.18,
                                    elevation: 8,
                                    transform: [{ scale: 1 }],
                                }}>
                                    <Text style={{
                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        fontSize: juicyWidBub * 0.045,
                                        color: '#003F25',
                                        textAlign: 'center',
                                        fontStyle: 'italic',
                                    }}>
                                        {addModalText}
                                    </Text>
                                </Animated.View>
                            </JuicyShakeView>
                        )}

                        {/* Елемент додавання в колекцію */}
                        {addModalVisible && (
                            <JuicyShakeView style={{
                                position: 'absolute',
                                top: 0,
                                height: juicyHighBub,
                                left: 0,
                                backgroundColor: 'rgba(62,225,156,0.18)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: juicyWidBub,
                                zIndex: 1000,
                            }}>
                                <BlurView
                                    style={{
                                        alignItems: 'center',
                                        position: 'absolute',
                                        backgroundColor: 'rgba(62,225,156,0.18)',
                                        zIndex: 1,
                                        width: juicyWidBub,
                                        height: juicyHighBub,
                                        left: 0,
                                        justifyContent: 'center',
                                        top: 0,
                                    }}
                                    blurType="light"
                                    blurAmount={1}
                                />
                                <Pressable
                                    onPress={() => {
                                        setAddModalVisible(false);
                                        setDropdownOpen(false);
                                    }}
                                    style={{ position: 'absolute', width: juicyWidBub, height: juicyWidBub, zIndex: 2 }}
                                />
                                <JuicyShakeView style={{
                                    zIndex: 2,
                                    width: juicyWidBub * 0.88,
                                    shadowRadius: 8,
                                    padding: juicyWidBub * 0.06,
                                    alignItems: 'center',
                                    shadowColor: '#3AE19C',
                                    shadowOffset: { width: 0, height: 2 },
                                    backgroundColor: '#6EECA6',
                                    shadowOpacity: 0.2,
                                    borderRadius: juicyWidBub * 0.07,
                                }}>
                                    {/* Header */}
                                    <JuicyShakeView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', alignSelf: 'center', marginBottom: juicyWidBub * 0.04 }}>
                                        <Text style={{
                                            fontFamily: juicyFonts.juicyBubblesPoppinsBlackItalic,
                                            fontSize: juicyWidBub * 0.06,
                                            color: '#003F25',
                                            fontWeight: 'bold',
                                            // marginBottom: juicyWidBub * 0.04,
                                            fontStyle: 'italic',
                                        }}>
                                            Add to Collection
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#003F25',
                                                borderRadius: juicyWidBub * 0.1,
                                                width: juicyWidBub * 0.09,
                                                height: juicyWidBub * 0.09,
                                                marginLeft: juicyWidBub * 0.02,
                                            }}
                                            onPress={() => setAddModalVisible(false)}
                                        >
                                            <Text onPress={() => setAddModalVisible(false)} style={{
                                                fontSize: juicyWidBub * 0.06,
                                                color: '#fff',
                                            }}>×</Text>
                                        </TouchableOpacity>
                                    </JuicyShakeView>
                                    {/* Dropdown */}
                                    <JuicyShakeView style={{
                                        alignItems: 'center',
                                        width: '100%',
                                        marginBottom: juicyWidBub * 0.06,
                                    }}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{
                                                paddingHorizontal: juicyWidBub * 0.04,
                                                backgroundColor: '#D9FFD9',
                                                width: '100%',
                                                borderRadius: juicyWidBub * 0.04,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                height: juicyHighBub * 0.059,
                                            }}
                                            onPress={() => collections.length > 0 && setDropdownOpen(!dropdownOpen)}
                                            disabled={collections.length === 0}
                                        >
                                            <Text style={{
                                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                                fontSize: juicyWidBub * 0.045,
                                                color: '#003F25',
                                                flex: 1,
                                            }}>
                                                {selectedCollection || (collections[0]?.juicyCollectionName ?? '')}
                                            </Text>
                                            {/* Down arrow from heroicons */}
                                            <Svg width={juicyWidBub * 0.07} height={juicyWidBub * 0.07} viewBox="0 0 24 24" fill="none">
                                                <Path
                                                    d="M19.5 8.25L12 15.75L4.5 8.25"
                                                    stroke="#003F25"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </Svg>
                                        </TouchableOpacity>
                                        {dropdownOpen && (
                                            <JuicyShakeView style={{
                                                position: 'absolute',
                                                top: juicyHighBub * 0.065,
                                                left: 0,
                                                width: '100%',
                                                backgroundColor: '#D9FFD9',
                                                borderRadius: juicyWidBub * 0.04,
                                                zIndex: 10,
                                                shadowColor: '#003F25',
                                                shadowOpacity: 0.08,
                                                shadowRadius: 8,
                                                paddingHorizontal: juicyWidBub * 0.02,
                                            }}>
                                                <Picker
                                                    selectedValue={selectedCollection}
                                                    style={{
                                                        width: '100%',
                                                        fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                                        fontSize: juicyWidBub * 0.045,
                                                        color: '#003F25',
                                                        backgroundColor: 'transparent',
                                                    }}
                                                    onValueChange={(itemValue) => {
                                                        setSelectedCollection(itemValue);
                                                        // setDropdownOpen(false);
                                                    }}
                                                    dropdownIconColor="#003F25"
                                                >
                                                    {collections.map((col, idx) => (
                                                        <Picker.Item label={col.juicyCollectionName} value={col.juicyCollectionName} key={col.juicyCollectionName + idx} />
                                                    ))}
                                                </Picker>
                                            </JuicyShakeView>
                                        )}
                                        {collections.length === 0 && (
                                            <Text style={{
                                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                                fontSize: juicyWidBub * 0.045,
                                                color: '#003F25',
                                                textAlign: 'center',
                                                marginTop: juicyWidBub * 0.02,
                                            }}>
                                                No collections available
                                            </Text>
                                        )}
                                    </JuicyShakeView>
                                    {/* Info: already in collections */}
                                    {alreadyInCollections.length > 0 && (
                                        <JuicyShakeView style={{ marginBottom: juicyWidBub * 0.02, alignItems: 'center' }}>
                                            <Text style={{
                                                fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                                fontSize: juicyWidBub * 0.04,
                                                color: '#D72E5F',
                                                textAlign: 'center',
                                            }}>
                                                Already in collections:
                                            </Text>
                                            {alreadyInCollections.map((col, idx) => (
                                                <Text key={col + idx} style={{
                                                    fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                                    fontSize: juicyWidBub * 0.04,
                                                    color: '#003F25',
                                                    textAlign: 'center',
                                                }}>
                                                    {col}
                                                </Text>
                                            ))}
                                        </JuicyShakeView>
                                    )}
                                    {/* Add button */}
                                    <TouchableOpacity
                                        style={{
                                            overflow: 'hidden',
                                            borderRadius: juicyWidBub * 0.04,
                                            height: juicyHighBub * 0.061,
                                            marginTop: juicyWidBub * 0.01,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                        disabled={collections.length === 0}
                                        onPress={handleAddToCollection}
                                    >
                                        <LinearGradient
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                position: 'absolute',
                                            }}
                                            end={{ x: 0.5, y: 1 }}
                                            colors={['#62D837', '#15A906']}
                                            start={{ x: 0.5, y: 0 }}
                                        />
                                        <Text style={{
                                            fontSize: juicyWidBub * 0.04,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontFamily: juicyFonts.juicyBubblesPoppinsMed,
                                        }}>
                                            Add
                                        </Text>
                                    </TouchableOpacity>
                                </JuicyShakeView>
                            </JuicyShakeView>
                        )}
                    </JuicyShakeView>
                </JuicyShakeView>
            </Modal>
        </JuicyShakeView>
    );
};

export default BubbleShakeJuicyMain;