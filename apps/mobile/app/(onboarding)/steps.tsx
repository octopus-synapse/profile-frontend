/**
 * Onboarding Steps Screen
 * Multi-step profile setup following B&W minimal design
 */

import { useState, useRef } from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 ScrollView,
 KeyboardAvoidingView,
 Platform,
 StatusBar,
 Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { useAuthStore } from "@profile/stores";
import {
 Button,
 Input as ProfileInput,
 Badge as ProfileBadge,
} from "@octopus-synapse/profile-ui";

const { width } = Dimensions.get("window");

// ============================================
// DESIGN TOKENS (matching Next.js)
// ============================================
const colors = {
 background: "#020202",
 surface: "#0a0a0a",
 surfaceElevated: "#171717",
 surfaceInput: "#0f0f0f",
 border: "rgba(255, 255, 255, 0.05)",
 borderSubtle: "rgba(255, 255, 255, 0.1)",
 borderFocus: "#06b6d4",

 textPrimary: "#ffffff",
 textSecondary: "#a3a3a3",
 textTertiary: "#525252",
 textMuted: "#71717a",
 textPlaceholder: "#3f3f46",

 accent: "#06b6d4",
 accentMuted: "rgba(6, 182, 212, 0.1)",
 accentBorder: "rgba(6, 182, 212, 0.3)",

 success: "#22c55e",
 error: "#ef4444",
};

// ============================================
// TYPES
// ============================================
interface OnboardingData {
 fullName: string;
 username: string;
 jobTitle: string;
 yearsOfExperience: string;
 techAreas: string[];
 bio: string;
}

type StepId =
 | "welcome"
 | "personal"
 | "username"
 | "professional"
 | "areas"
 | "review";

interface Step {
 id: StepId;
 badge: string;
 title: string;
 titleHighlight?: string;
 description: string;
}

const steps: Step[] = [
 {
  id: "welcome",
  badge: "INÍCIO",
  title: "Vamos",
  titleHighlight: "Começar.",
  description: "Configure seu perfil profissional em alguns passos simples.",
 },
 {
  id: "personal",
  badge: "01 — IDENTIDADE",
  title: "Quem é",
  titleHighlight: "Você?",
  description: "Seu nome completo como aparecerá no currículo.",
 },
 {
  id: "username",
  badge: "02 — HANDLE",
  title: "Seu",
  titleHighlight: "@username",
  description: "Um identificador único para seu perfil público.",
 },
 {
  id: "professional",
  badge: "03 — PROFISSÃO",
  title: "O que você",
  titleHighlight: "Faz?",
  description: "Sua função atual e tempo de experiência.",
 },
 {
  id: "areas",
  badge: "04 — EXPERTISE",
  title: "Suas",
  titleHighlight: "Áreas.",
  description: "Selecione até 3 áreas de atuação.",
 },
 {
  id: "review",
  badge: "FINALIZAÇÃO",
  title: "Tudo",
  titleHighlight: "Pronto.",
  description: "Revise suas informações antes de continuar.",
 },
];

const techAreaOptions = [
 { id: "dev", label: "Development", icon: "⌨️" },
 { id: "design", label: "Design", icon: "🎨" },
 { id: "product", label: "Product", icon: "📊" },
 { id: "data", label: "Data", icon: "📈" },
 { id: "devops", label: "DevOps", icon: "⚙️" },
 { id: "security", label: "Security", icon: "🔒" },
 { id: "qa", label: "QA", icon: "✓" },
 { id: "research", label: "Research", icon: "🔬" },
];

// ============================================
// COMPONENTS
// ============================================

const ProgressBar = ({
 current,
 total,
}: {
 current: number;
 total: number;
}) => (
 <View
  style={{
   height: 2,
   backgroundColor: colors.surfaceElevated,
   borderRadius: 1,
   overflow: "hidden",
  }}
 >
  <View
   style={{
    height: "100%",
    width: `${((current + 1) / total) * 100}%`,
    backgroundColor: colors.accent,
    borderRadius: 1,
   }}
  />
 </View>
);

const Input = ({
 label,
 value,
 onChangeText,
 placeholder,
 autoCapitalize = "words",
 keyboardType = "default",
 prefix,
}: {
 label: string;
 value: string;
 onChangeText: (text: string) => void;
 placeholder: string;
 autoCapitalize?: "none" | "words" | "sentences" | "characters";
 keyboardType?: "default" | "email-address" | "numeric";
 prefix?: string;
}) => (
 <Animated.View entering={FadeInUp.delay(200).duration(400)}>
  <Text
   style={{
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: 8,
    fontFamily: "monospace",
   }}
  >
   {label}
  </Text>
  <ProfileInput
   placeholder={placeholder}
   value={value}
   onChangeText={onChangeText}
   leftAddon={
    prefix ? (
     <Text
      style={{
       fontSize: 16,
       color: colors.textTertiary,
       marginRight: 4,
      }}
     >
      {prefix}
     </Text>
    ) : undefined
   }
   textInputProps={{
    autoCapitalize,
    keyboardType,
   }}
  />
 </Animated.View>
);

const AreaChip = ({
 label,
 icon,
 selected,
 onPress,
}: {
 label: string;
 icon: string;
 selected: boolean;
 onPress: () => void;
}) => (
 <TouchableOpacity
  onPress={onPress}
  style={{
   flexDirection: "row",
   alignItems: "center",
   gap: 8,
   paddingHorizontal: 16,
   paddingVertical: 12,
   borderRadius: 12,
   backgroundColor: selected ? colors.accentMuted : colors.surface,
   borderWidth: 1,
   borderColor: selected ? colors.accentBorder : colors.border,
  }}
 >
  <Text style={{ fontSize: 16 }}>{icon}</Text>
  <Text
   style={{
    fontSize: 14,
    fontWeight: selected ? "600" : "400",
    color: selected ? colors.accent : colors.textSecondary,
   }}
  >
   {label}
  </Text>
  {selected && (
   <View
    style={{
     marginLeft: "auto",
     height: 16,
     width: 16,
     borderRadius: 8,
     backgroundColor: colors.accent,
     alignItems: "center",
     justifyContent: "center",
    }}
   >
    <Text style={{ fontSize: 10, color: colors.background }}>✓</Text>
   </View>
  )}
 </TouchableOpacity>
);

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
 <View
  style={{
   paddingVertical: 16,
   borderBottomWidth: 1,
   borderBottomColor: colors.border,
  }}
 >
  <Text
   style={{
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: 4,
    fontFamily: "monospace",
   }}
  >
   {label}
  </Text>
  <Text
   style={{
    fontSize: 16,
    color: colors.textPrimary,
   }}
  >
   {value || "—"}
  </Text>
 </View>
);

// ============================================
// MAIN SCREEN
// ============================================
export default function OnboardingStepsScreen() {
 const router = useRouter();
 const [currentStep, setCurrentStep] = useState(0);
 const [isLoading, setIsLoading] = useState(false);
 const [data, setData] = useState<OnboardingData>({
  fullName: "",
  username: "",
  jobTitle: "",
  yearsOfExperience: "",
  techAreas: [],
  bio: "",
 });

 const step = steps[currentStep];
 const isFirstStep = currentStep === 0;
 const isLastStep = currentStep === steps.length - 1;

 const canProceed = () => {
  switch (step?.id) {
   case "welcome":
    return true;
   case "personal":
    return data.fullName.trim().length >= 2;
   case "username":
    return data.username.trim().length >= 3;
   case "professional":
    return data.jobTitle.trim().length >= 2;
   case "areas":
    return data.techAreas.length >= 1;
   case "review":
    return true;
   default:
    return false;
  }
 };

 const handleNext = async () => {
  if (!canProceed()) return;

  if (isLastStep) {
   setIsLoading(true);
   try {
    // TODO: Call API to save onboarding data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.replace("/(app)");
   } catch (error) {
    console.error("Onboarding error:", error);
   } finally {
    setIsLoading(false);
   }
  } else {
   setCurrentStep((prev) => prev + 1);
  }
 };

 const handleBack = () => {
  if (!isFirstStep) {
   setCurrentStep((prev) => prev - 1);
  }
 };

 const toggleArea = (areaId: string) => {
  setData((prev) => {
   const areas = prev.techAreas.includes(areaId)
    ? prev.techAreas.filter((a) => a !== areaId)
    : prev.techAreas.length < 3
      ? [...prev.techAreas, areaId]
      : prev.techAreas;
   return { ...prev, techAreas: areas };
  });
 };

 const renderStepContent = () => {
  switch (step?.id) {
   case "welcome":
    return (
     <Animated.View entering={FadeIn.duration(400)}>
      <View
       style={{
        height: 120,
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        backgroundColor: colors.accentMuted,
        borderWidth: 1,
        borderColor: colors.accentBorder,
        marginBottom: 32,
       }}
      >
       <Text style={{ fontSize: 48 }}>🚀</Text>
      </View>
     </Animated.View>
    );

   case "personal":
    return (
     <Input
      label="Nome Completo"
      value={data.fullName}
      onChangeText={(text) => setData({ ...data, fullName: text })}
      placeholder="Maria Silva"
      autoCapitalize="words"
     />
    );

   case "username":
    return (
     <Input
      label="Username"
      value={data.username}
      onChangeText={(text) =>
       setData({ ...data, username: text.toLowerCase().replace(/\s/g, "") })
      }
      placeholder="mariasilva"
      autoCapitalize="none"
      prefix="@"
     />
    );

   case "professional":
    return (
     <View style={{ gap: 24 }}>
      <Input
       label="Cargo / Função"
       value={data.jobTitle}
       onChangeText={(text) => setData({ ...data, jobTitle: text })}
       placeholder="Software Engineer"
       autoCapitalize="words"
      />
      <Input
       label="Anos de Experiência"
       value={data.yearsOfExperience}
       onChangeText={(text) => setData({ ...data, yearsOfExperience: text })}
       placeholder="5"
       keyboardType="numeric"
      />
     </View>
    );

   case "areas":
    return (
     <Animated.View entering={FadeInUp.delay(200).duration(400)}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
       {techAreaOptions.map((area) => (
        <AreaChip
         key={area.id}
         label={area.label}
         icon={area.icon}
         selected={data.techAreas.includes(area.id)}
         onPress={() => toggleArea(area.id)}
        />
       ))}
      </View>
      <Text
       style={{
        fontSize: 12,
        color: colors.textTertiary,
        marginTop: 16,
        fontFamily: "monospace",
       }}
      >
       {data.techAreas.length}/3 selecionadas
      </Text>
     </Animated.View>
    );

   case "review":
    return (
     <Animated.View entering={FadeInUp.delay(200).duration(400)}>
      <View
       style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 20,
       }}
      >
       <ReviewItem label="Nome" value={data.fullName} />
       <ReviewItem label="Username" value={`@${data.username}`} />
       <ReviewItem label="Cargo" value={data.jobTitle} />
       <ReviewItem
        label="Experiência"
        value={data.yearsOfExperience ? `${data.yearsOfExperience} anos` : ""}
       />
       <ReviewItem
        label="Áreas"
        value={data.techAreas
         .map((id) => techAreaOptions.find((a) => a.id === id)?.label || id)
         .join(", ")}
       />
      </View>
     </Animated.View>
    );

   default:
    return null;
  }
 };

 if (!step) return null;

 return (
  <View style={{ flex: 1, backgroundColor: colors.background }}>
   <StatusBar barStyle="light-content" backgroundColor={colors.background} />

   {/* Header */}
   <View
    style={{
     paddingTop: 64,
     paddingHorizontal: 24,
     paddingBottom: 16,
     borderBottomWidth: 1,
     borderBottomColor: colors.border,
    }}
   >
    <ProgressBar current={currentStep} total={steps.length} />
    <View
     style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
     }}
    >
     {!isFirstStep ? (
      <TouchableOpacity onPress={handleBack}>
       <Text
        style={{
         fontSize: 12,
         color: colors.textSecondary,
         fontFamily: "monospace",
        }}
       >
        ← Voltar
       </Text>
      </TouchableOpacity>
     ) : (
      <View />
     )}
     <Text
      style={{
       fontSize: 10,
       color: colors.textMuted,
       fontFamily: "monospace",
      }}
     >
      {currentStep + 1}/{steps.length}
     </Text>
    </View>
   </View>

   {/* Content */}
   <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
   >
    <ScrollView
     contentContainerStyle={{
      flexGrow: 1,
      padding: 24,
     }}
     showsVerticalScrollIndicator={false}
    >
     {/* Step Header */}
     <Animated.View
      key={step.id}
      entering={FadeInUp.duration(400)}
      style={{ marginBottom: 32 }}
     >
      <ProfileBadge variant="outline" dot>
       {step.badge}
      </ProfileBadge>
      <View style={{ marginTop: 24 }}>
       <Text
        style={{
         fontSize: 40,
         fontWeight: "500",
         letterSpacing: -1.5,
         lineHeight: 40,
         color: colors.textPrimary,
        }}
       >
        {step.title}
       </Text>
       {step.titleHighlight && (
        <Text
         style={{
          fontSize: 40,
          fontWeight: "500",
          letterSpacing: -1.5,
          lineHeight: 40,
          fontStyle: "italic",
          color: colors.textTertiary,
          marginTop: 2,
         }}
        >
         {step.titleHighlight}
        </Text>
       )}
      </View>
      <Text
       style={{
        fontSize: 16,
        lineHeight: 24,
        color: colors.textSecondary,
        marginTop: 16,
       }}
      >
       {step.description}
      </Text>
     </Animated.View>

     {/* Step Content */}
     {renderStepContent()}
    </ScrollView>
   </KeyboardAvoidingView>

   {/* Footer */}
   <View
    style={{
     paddingHorizontal: 24,
     paddingBottom: 48,
     paddingTop: 16,
     borderTopWidth: 1,
     borderTopColor: colors.border,
     backgroundColor: colors.background,
    }}
   >
    <Button
     onPress={handleNext}
     disabled={!canProceed() || isLoading}
     loading={isLoading}
     variant="primary"
     fullWidth
     rightIcon={
      !isLoading ? (
       <Text
        style={{
         color: colors.background,
         fontSize: 16,
        }}
       >
        →
       </Text>
      ) : undefined
     }
    >
     {isLastStep ? "Concluir" : "Continuar"}
    </Button>
   </View>
  </View>
 );
}
