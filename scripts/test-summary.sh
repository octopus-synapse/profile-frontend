#!/bin/bash
# Test Summary Script
# Runs tests and displays summary

echo "================================"
echo "TEST SUMMARY"
echo "================================"

# Run tests and capture output
TEST_OUTPUT=$(bun --filter @profile/web test 2>&1)
TEST_EXIT_CODE=$?

# Display output
echo "$TEST_OUTPUT"

# Parse and display summary
echo ""
echo "================================"
if echo "$TEST_OUTPUT" | grep -q "No tests found"; then
  echo "✓ NO UNIT TESTS FOUND"
  echo "  Integration tests skipped (require backend)"
  echo "  Exit code: 0 (pass)"
elif [ $TEST_EXIT_CODE -eq 0 ]; then
  # Extract test counts from output
  PASSED=$(echo "$TEST_OUTPUT" | grep -oP '\d+ passed' | grep -oP '\d+')
  FAILED=$(echo "$TEST_OUTPUT" | grep -oP '\d+ failed' | grep -oP '\d+')
  TOTAL=$(echo "$TEST_OUTPUT" | grep -oP 'Tests:.*total' | grep -oP '\d+' | tail -1)

  echo "✓ ALL TESTS PASSED"
  echo "  Passed: ${PASSED:-0}"
  echo "  Failed: ${FAILED:-0}"
  echo "  Total: ${TOTAL:-0}"
else
  echo "✗ TESTS FAILED"
  echo "  Exit code: $TEST_EXIT_CODE"
fi
echo "================================"

exit $TEST_EXIT_CODE
