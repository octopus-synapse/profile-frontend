/**
 * Intro Slides Screen
 * Following Next.js landing page design: B&W minimal with cyan accents
 * "Your Career, PATCHED."
 */

import { useRef, useState } from "react";
import {
 View,
 Text,
 Dimensions,
 TouchableOpacity,
 FlatList,
 Animated as RNAnimated,
 StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Badge as ProfileBadge } from "@octopus-synapse/profile-ui";

const { width, height } = Dimensions.get("window");
const INTRO_SEEN_KEY = "@patch_intro_seen";

// ============================================
// DESIGN TOKENS (matching Next.js landing)
// ============================================
const colors = {
 background: "#020202",
 surface: "#0a0a0a",
 surfaceElevated: "#171717",
 border: "rgba(255, 255, 255, 0.05)",
 borderSubtle: "rgba(255, 255, 255, 0.1)",

 textPrimary: "#ffffff",
 textSecondary: "#a3a3a3",
 textTertiary: "#525252",
 textMuted: "#71717a",

 accent: "#06b6d4", // cyan-500
 accentLight: "#22d3ee", // cyan-400
 accentMuted: "rgba(6, 182, 212, 0.1)",
 accentBorder: "rgba(6, 182, 212, 0.2)",
};

// ============================================
// SLIDE DATA
// ============================================
interface Slide {
 id: string;
 badge?: string;
 title: string;
 titleHighlight?: string;
 description: string;
 subdescription?: string;
 icon: string;
}

const slides: Slide[] = [
 {
  id: "1",
  badge: "BUILT BY TECH, FOR TECH",
  title: "Your Career,",
  titleHighlight: "PATCHED.",
  description: "The professional resume platform that speaks your language.",
  subdescription: "Designed by developers who understand technical careers.",
  icon: "⚡",
 },
 {
  id: "2",
  badge: "IDENTITY INVARIANCE",
  title: "One Profile,",
  titleHighlight: "Infinite Versions.",
  description:
   "Your core identity stays constant. We compile it into the perfect format for each opportunity.",
  subdescription: "ATS-optimized, beautifully formatted, always authentic.",
  icon: "🎯",
 },
 {
  id: "3",
  badge: "SMART COMPILATION",
  title: "Templates That",
  titleHighlight: "Get Past Bots.",
  description:
   "94% average ATS compatibility score. Your skills parsed correctly, every time.",
  subdescription: "Because your experience deserves to be seen.",
  icon: "✓",
 },
 {
  id: "4",
  badge: "REAL-TIME SYNC",
  title: "Collaborate.",
  titleHighlight: "Iterate. Ship.",
  description:
   "Get instant feedback from mentors and peers. Version control for your career.",
  subdescription: "Every edit tracked. Nothing lost.",
  icon: "↗",
 },
 {
  id: "5",
  badge: "READY?",
  title: "Let's Build",
  titleHighlight: "Your Future.",
  description: "Create your professional profile in minutes.",
  subdescription: "Your next opportunity is one PATCH away.",
  icon: "→",
 },
];

// ============================================
// COMPONENTS
// ============================================

const DotIndicator = ({
 total,
 current,
}: {
 total: number;
 current: number;
}) => (
 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
  {Array.from({ length: total }).map((_, i) => (
   <View
    key={i}
    style={{
     width: i === current ? 24 : 8,
     height: 8,
     borderRadius: 4,
     backgroundColor: i === current ? colors.accent : colors.surfaceElevated,
     borderWidth: 1,
     borderColor: i === current ? colors.accent : colors.borderSubtle,
    }}
   />
  ))}
 </View>
);

// ============================================
// MAIN SCREEN
// ============================================
export default function IntroScreen() {
 const router = useRouter();
 const [currentIndex, setCurrentIndex] = useState(0);
 const flatListRef = useRef<FlatList>(null);
 const scrollX = useRef(new RNAnimated.Value(0)).current;

 const handleNext = () => {
  if (currentIndex < slides.length - 1) {
   flatListRef.current?.scrollToIndex({
    index: currentIndex + 1,
    animated: true,
   });
  } else {
   completeIntro();
  }
 };

 const handleSkip = () => {
  completeIntro();
 };

 const completeIntro = async () => {
  try {
   await AsyncStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch (e) {
   // Ignore storage errors
  }
  router.replace("/(auth)/login");
 };

 const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const opacity = scrollX.interpolate({
   inputRange,
   outputRange: [0, 1, 0],
   extrapolate: "clamp",
  });

  const translateY = scrollX.interpolate({
   inputRange,
   outputRange: [50, 0, 50],
   extrapolate: "clamp",
  });

  return (
   <RNAnimated.View
    style={{
     width,
     height,
     opacity,
     transform: [{ translateY }],
     paddingHorizontal: 24,
     justifyContent: "center",
    }}
   >
    {/* Badge */}
    {item.badge && (
     <Animated.View
      entering={FadeInUp.delay(100).duration(600)}
      style={{ marginBottom: 32 }}
     >
      <ProfileBadge variant="outline" dot>
       {item.badge}
      </ProfileBadge>
     </Animated.View>
    )}

    {/* Icon */}
    <Animated.View
     entering={FadeInUp.delay(200).duration(600)}
     style={{ marginBottom: 24 }}
    >
     <View
      style={{
       height: 64,
       width: 64,
       alignItems: "center",
       justifyContent: "center",
       borderRadius: 16,
       backgroundColor: colors.accentMuted,
       borderWidth: 1,
       borderColor: colors.accentBorder,
      }}
     >
      <Text style={{ fontSize: 28 }}>{item.icon}</Text>
     </View>
    </Animated.View>

    {/* Title */}
    <Animated.View entering={FadeInUp.delay(300).duration(600)}>
     <Text
      style={{
       fontSize: 48,
       fontWeight: "500",
       letterSpacing: -2,
       lineHeight: 48,
       color: colors.textPrimary,
      }}
     >
      {item.title}
     </Text>
     {item.titleHighlight && (
      <Text
       style={{
        fontSize: 48,
        fontWeight: "500",
        letterSpacing: -2,
        lineHeight: 48,
        fontStyle: "italic",
        marginTop: 4,
        color: colors.textTertiary,
       }}
      >
       {item.titleHighlight}
      </Text>
     )}
    </Animated.View>

    {/* Description */}
    <Animated.View
     entering={FadeInUp.delay(400).duration(600)}
     style={{ marginTop: 32 }}
    >
     <Text
      style={{
       fontSize: 18,
       fontWeight: "500",
       lineHeight: 28,
       color: colors.textPrimary,
      }}
     >
      {item.description}
     </Text>
     {item.subdescription && (
      <Text
       style={{
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
        color: colors.textSecondary,
       }}
      >
       {item.subdescription}
      </Text>
     )}
    </Animated.View>
   </RNAnimated.View>
  );
 };

 const isLastSlide = currentIndex === slides.length - 1;

 return (
  <View style={{ flex: 1, backgroundColor: colors.background }}>
   <StatusBar barStyle="light-content" backgroundColor={colors.background} />

   {/* Skip button */}
   <View style={{ position: "absolute", top: 64, right: 24, zIndex: 10 }}>
    <Button variant="ghost" size="sm" onPress={handleSkip}>
     Pular
    </Button>
   </View>

   {/* Slides */}
   <FlatList
    ref={flatListRef}
    data={slides}
    renderItem={renderSlide}
    keyExtractor={(item) => item.id}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    bounces={false}
    onScroll={RNAnimated.event(
     [{ nativeEvent: { contentOffset: { x: scrollX } } }],
     { useNativeDriver: true }
    )}
    onMomentumScrollEnd={(event) => {
     const index = Math.round(event.nativeEvent.contentOffset.x / width);
     setCurrentIndex(index);
    }}
    scrollEventThrottle={16}
   />

   {/* Bottom section */}
   <View
    style={{
     position: "absolute",
     bottom: 0,
     left: 0,
     right: 0,
     paddingHorizontal: 24,
     paddingBottom: 48,
     paddingTop: 24,
     backgroundColor: colors.background,
     borderTopWidth: 1,
     borderTopColor: colors.border,
    }}
   >
    {/* Progress dots */}
    <View
     style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
     }}
    >
     <DotIndicator total={slides.length} current={currentIndex} />
     <Text
      style={{
       fontSize: 12,
       color: colors.textMuted,
       fontFamily: "monospace",
      }}
     >
      {currentIndex + 1}/{slides.length}
     </Text>
    </View>

    {/* CTA Button */}
    <Button
     onPress={handleNext}
     variant={isLastSlide ? "primary" : "secondary"}
     fullWidth
     rightIcon={
      <Text
       style={{
        color: isLastSlide ? colors.background : colors.textSecondary,
        fontSize: 16,
       }}
      >
       →
      </Text>
     }
    >
     {isLastSlide ? "Começar Agora" : "Continuar"}
    </Button>

    {/* Scroll hint on first slide */}
    {currentIndex === 0 && (
     <View style={{ alignItems: "center", marginTop: 16 }}>
      <View
       style={{
        height: 24,
        width: 1,
        marginBottom: 8,
        backgroundColor: colors.textTertiary,
        opacity: 0.3,
       }}
      />
      <Text
       style={{
        fontSize: 9,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: colors.textTertiary,
        fontFamily: "monospace",
       }}
      >
       Deslize para explorar
      </Text>
     </View>
    )}
   </View>
  </View>
 );
}
