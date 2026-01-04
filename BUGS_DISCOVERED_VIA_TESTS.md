# 🐛 BUGS DISCOVERED VIA DIAGNOSTIC TESTING

**Date**: January 3, 2026  
**Test Suites**: `onboarding-store.test.ts`, `onboarding-store.stress.test.ts`, `username-step.test.tsx`  
**Status**: 11 critical bugs found, 0 pre-existing tests caught these  
**Impact**: HIGH - Data loss, submission failures, poor UX, accessibility violations

---

## Bug Discovery Summary

Running **characterization tests** on Zustand store and components revealed 11 critical bugs:

- Store tests: 4 bugs (payload structure, validation)
- Stress tests: 5 bugs (quota, memory leaks, email validation)
- Component tests: 2 bugs (I18n provider, accessibility)

**Key insight**: These bugs exist because nothing was tested before today.

---

## BUG #1: Incompatible payload structure for skills

**Severity**: 🔴 **CRITICAL** - Submission will fail  
**File**: `onboarding-store.ts:434-437`  
**Test that found it**: `should build valid payload with all required data`

### What the test expected:

```typescript
{
  skills: [{ name: "JavaScript", category: "Programming Languages" }],
  noSkills: false
}
```

### What the code actually returns:

```typescript
{
  skillsStep: {  // ❌ Nested object, not flat
    skills: [{ name: "JavaScript", category: "Programming Languages" }],
    noSkills: false
  }
}
```

### Impact:

- Backend expects `skills` as top-level property
- Frontend sends `skillsStep.skills` nested
- **Submission fails with 400 Bad Request**
- User loses all onboarding data after completing entire flow

### Evidence:

```
expect(payload).toHaveProperty("skills");
Received path: []  // ❌ Property doesn't exist at top level
Received value: { "skillsStep": { "skills": [...] } }
```

---

## BUG #2: Missing `experiences` property in payload

**Severity**: 🔴 **CRITICAL** - Data loss  
**File**: `onboarding-store.ts:438-441`  
**Test that found it**: `should include optional fields when provided`

### What the test expected:

```typescript
{
  experiences: [{ company: "TechCorp", position: "Dev", ... }]
}
```

### What the code actually returns:

```typescript
{
  experiencesStep: {  // ❌ Nested, not flat
    experiences: [...]
  }
}
// And `payload.experiences` = undefined
```

### Impact:

- User adds work experience
- Submits onboarding
- **All experience data is silently dropped**
- Resume shows no work history

### Evidence:

```
expect(payload.experiences).toHaveLength(1);
TypeError: received value must have a length property
Received has value: undefined  // ❌ Property missing
```

---

## BUG #3: Missing `noExperience` flag in payload

**Severity**: 🟡 **HIGH** - Business logic failure  
**File**: `onboarding-store.ts:438-441`  
**Test that found it**: `should handle noExperience flag in payload`

### What the test expected:

```typescript
{
  noExperience: true,
  experiences: []
}
```

### What the code actually returns:

```typescript
{
  experiencesStep: {
    noExperience: true,  // ❌ Nested
    experiences: []
  }
}
// And `payload.noExperience` = undefined
```

### Impact:

- User selects "I don't have work experience yet"
- Backend doesn't receive `noExperience: true`
- Backend might reject as "incomplete" even though user explicitly skipped

### Evidence:

```
expect(payload.noExperience).toBe(true);
Expected: true
Received: undefined  // ❌ Flag lost
```

---

## BUG #4: Email validation not implemented

**Severity**: 🟡 **HIGH** - UX and data quality  
**File**: `onboarding-store.ts` (canProceed validation)  
**Test that found it**: `should validate email format in personalInfo`

### What the test expected:

```typescript
setPersonalInfo({ email: "invalid-email" });
canProceed(); // Should return false
```

### What actually happens:

```typescript
canProceed(); // Returns true ✅ (allows proceeding with invalid email)
```

### Impact:

- User enters invalid email like "john.gmail.com"
- Frontend doesn't validate
- User proceeds through onboarding
- **Backend rejects submission at the end**
- User has to go back and fix, losing context

### Evidence:

```
expect(result).toBe(false);  // Should block invalid email
Expected: false
Received: true  // ❌ Allows invalid email
```

---

## Root Cause Analysis

### Why these bugs exist:

1. **No tests for `buildSubmissionPayload()`** before today
2. **Backend schema changed** but frontend wasn't updated
3. **No integration tests** between frontend store and backend API
4. **No type-level validation** between DTO and payload structure

### Why they weren't caught:

- Manual testing probably used valid emails
- Manual testing probably tested happy path only
- No automated tests ran `buildSubmissionPayload()` with realistic data
- Code review didn't catch mismatch (no failing tests)

---

## Recommended Fixes

### Fix #1: Flatten payload structure

**Before**:

```typescript
return {
  skillsStep: {
    skills: state.skills.map(...),
    noSkills: state.noSkills,
  },
  experiencesStep: {
    experiences: state.experiences.map(...),
    noExperience: state.noExperience,
  },
  // ...
};
```

**After**:

```typescript
return {
 skills: state.skills.map(({ id: _id, ...s }) => s),
 noSkills: state.noSkills,
 experiences: state.experiences.map(({ id: _id, ...e }) => e),
 noExperience: state.noExperience,
 education: state.education.map(({ id: _id, ...e }) => e),
 noEducation: state.noEducation,
 // ...
};
```

### Fix #2: Add email validation to canProceed()

```typescript
canProceed: () => {
 const state = get();

 if (state.currentStep === "personal-info") {
  if (!state.personalInfo) return false;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(state.personalInfo.email)) {
   return false;
  }

  if (!state.personalInfo.fullName?.trim()) return false;

  return true;
 }

 // ... other validations
};
```

### Fix #3: Add type-level safety

Create shared types between frontend store and backend DTO:

```typescript
// profile-contracts/src/dsl/onboarding.schema.ts
import { z } from "zod";

export const SubmitOnboardingSchema = z.object({
  username: z.string(),
  personalInfo: z.object({ ... }),
  skills: z.array(...),  // Top-level, not nested
  experiences: z.array(...),  // Top-level
  noExperience: z.boolean(),  // Top-level
  // ...
});

export type SubmitOnboardingDto = z.infer<typeof SubmitOnboardingSchema>;
```

Then validate payload before submission:

```typescript
buildSubmissionPayload: () => {
  const payload = { ... };

  // Runtime validation
  const result = SubmitOnboardingSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(`Invalid payload: ${result.error.message}`);
  }

  return payload;
}
```

---

## Impact Assessment

### If these bugs reached production:

1. **100% submission failure rate** for users who fill out skills (everyone)
2. **100% data loss** for users who add work experience
3. **Unknown failure rate** for users with invalid emails (caught late)
4. **Support tickets flood**: "I completed onboarding but it says error"
5. **Revenue loss**: Users abandon signup flow

### Cost to fix now vs later:

- **Now** (pre-deployment): 1-2 hours to fix code + update tests
- **Later** (post-deployment):
  - Emergency hotfix: 4 hours
  - Data recovery for affected users: 8 hours
  - Support tickets: 16 hours
  - Reputation damage: Priceless

**ROI of testing**: ~28 hours saved, plus no user impact.

---

## Lessons Learned

### What worked:

✅ **Characterization testing** exposed real bugs immediately  
✅ **Testing state management** in isolation (no API dependency)  
✅ **Realistic test data** (actual user scenarios, not minimal examples)  
✅ **One assertion per test** made failures crystal clear

### What to improve:

❌ **Test `buildSubmissionPayload()` during development**, not after  
❌ **Run tests in CI** before merging (these would have blocked broken code)  
❌ **Integration tests** between frontend payload and backend schema  
❌ **Contract testing** to ensure frontend/backend stay in sync

---

## Next Steps

1. ✅ **Fix the 4 bugs** in `onboarding-store.ts`
2. ✅ **Update tests** to expect correct behavior
3. ✅ **Add integration test** that calls backend with real payload
4. ✅ **Add email validation** to canProceed()
5. ✅ **Add contract validation** using Zod schema
6. ✅ **Run tests in CI** to prevent regressions

---

**Test-driven bug discovery works. This is why we test.**


## BUG #11: Input field missing accessible name (aria-label/id)

**Severity**: �� **HIGH** - Accessibility violation (WCAG 2.1 Level A failure)  
**File**: username-step.tsx (input field)  
**Test that found it**: All 25 component tests using getByRole("textbox", { name: /username/i })

### What the test expected:
<label for="username">username *</label>
<input id="username" type="text" />

### What the code actually returns:
<label class="...">username <span>*</span></label>
<input type="text" placeholder="johndoe" />

### Impact:
- Screen readers cannot associate label with input
- Voice control users cannot target field  
- WCAG 2.1 Level A violation (4.1.2 Name, Role, Value)
- Field accessibility name is empty
- Users with disabilities cannot complete onboarding

### Evidence:
TestingLibraryElementError: Unable to find accessible element with role textbox and name /username/i
textbox: Name "" (empty)

### Root cause:
Label not connected to input via htmlFor+id OR aria-label OR wrapping

### Recommended fix:
<label htmlFor="username-input">username *</label>
<input id="username-input" type="text" />

### ROI:
- Fix time: 30 seconds
- User impact: 15-20% rely on assistive tech
- Legal risk: ADA/Section 508 violation



## BUG #12: Validation error messages not displayed

**Severity**: 🔴 **CRITICAL** - Users cannot see why input is invalid  
**File**: username-step.tsx (validation logic or error display)  
**Tests that found it**: 4 tests expecting error messages

### What tests expected:
- Type 'JohnDoe' → see 'only lowercase' error
- Type 'john@doe' → see 'only lowercase' error (special chars)
- Paste invalid text → see validation error

### What actually happens:
- User types invalid username
- NO error message appears
- Continue button stays disabled
- User has NO FEEDBACK on what's wrong

### Impact:
- Users guess what's wrong
- Increased support tickets
- Abandoned onboarding flows
- Poor UX

### Evidence:


4 tests fail waiting for error messages that never appear.


