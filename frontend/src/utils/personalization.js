/**
 * Personalization utilities for human touch and warm content
 */

// Get personalized greeting based on time of day
export const getPersonalizedGreeting = (displayName) => {
  const hour = new Date().getHours();
  const name = displayName || 'there';
  
  let greeting;
  let emoji;
  
  if (hour >= 5 && hour < 12) {
    greeting = `Good morning, ${name}!`;
    emoji = '🌅';
  } else if (hour >= 12 && hour < 17) {
    greeting = `Good afternoon, ${name}!`;
    emoji = '☀️';
  } else if (hour >= 17 && hour < 21) {
    greeting = `Good evening, ${name}!`;
    emoji = '🌆';
  } else {
    greeting = `Hey ${name}, still up?`;
    emoji = '🌙';
  }
  
  return { greeting, emoji };
};

// Get encouraging message based on user activity
export const getEncouragingMessage = (stats) => {
  const { habitsCompleted, streak, moodCount, journalCount } = stats || {};
  
  const messages = [];
  
  if (streak > 0) {
    if (streak >= 7) {
      messages.push({ text: `🔥 Amazing ${streak}-day streak! You're on fire!`, type: 'celebration' });
    } else if (streak >= 3) {
      messages.push({ text: `✨ ${streak} days strong! Keep it going!`, type: 'encouragement' });
    } else {
      messages.push({ text: `💪 Day ${streak} of your streak! Every day counts.`, type: 'support' });
    }
  }
  
  if (habitsCompleted > 0) {
    messages.push({ 
      text: `🎯 You've completed ${habitsCompleted} habit${habitsCompleted > 1 ? 's' : ''} today!`, 
      type: 'achievement' 
    });
  }
  
  if (moodCount > 0) {
    messages.push({ 
      text: `💭 You've been tracking your mood - that's self-awareness in action!`, 
      type: 'acknowledgment' 
    });
  }
  
  if (journalCount > 0) {
    messages.push({ 
      text: `📝 Your journal entries show real reflection. Keep writing!`, 
      type: 'acknowledgment' 
    });
  }
  
  if (messages.length === 0) {
    messages.push({ 
      text: `🌟 Ready to start your wellness journey? Every small step matters.`, 
      type: 'welcome' 
    });
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get personalized insight comments
export const getPersonalizedInsight = (data, type) => {
  const insights = {
    mood: {
      improving: [
        "Your mood's been on the up! 🌈 That's wonderful to see.",
        "You're trending upward - keep doing what makes you feel good! ✨",
        "The positive trend in your mood is something to celebrate! 🎉"
      ],
      stable: [
        "Your mood's been steady - consistency is its own kind of strength. 💪",
        "Stability in your emotional landscape is valuable. You're doing great! 🌱"
      ],
      declining: [
        "I notice your mood's been lower lately. That's okay - we all have tough periods. 💙",
        "Remember, it's okay not to be okay. You're not alone in this. 🤗",
        "Difficult times don't last, but you do. Take it one day at a time. 🌱"
      ]
    },
    habits: {
      high: [
        "You're crushing your habits! 🚀 This consistency is building something real.",
        "Look at you go! Your dedication is showing. 💪",
        "Your habit game is strong! Keep this momentum! 🔥"
      ],
      medium: [
        "You're making progress! Every completed habit is a win. ✨",
        "Nice work today! Small steps lead to big changes. 🌱"
      ],
      low: [
        "Starting is the hardest part - and you've already done that! 🌟",
        "Every journey begins with a single step. You've got this! 💙"
      ]
    },
    sleep: {
      good: [
        "Your sleep patterns look healthy! Rest is self-care. 😴",
        "Great sleep hygiene! Your body will thank you. 🌙"
      ],
      needsImprovement: [
        "Sleep is foundational. Consider a wind-down routine - you deserve rest. 💤",
        "Quality sleep makes everything better. Small changes can help! 🌙"
      ]
    }
  };
  
  const category = insights[type];
  if (!category) return "Keep tracking - awareness is the first step! 🌟";
  
  const key = Object.keys(category)[0]; // Simplified - would need actual logic
  const messages = category[key] || category[Object.keys(category)[0]];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Get action recommendations
export const getActionRecommendation = (context) => {
  const recommendations = {
    noHabits: "Start with one small habit - maybe drinking water or a 5-minute walk? 💧",
    noMood: "How are you feeling right now? Logging your mood helps you understand patterns. 💭",
    noJournal: "Take a moment to reflect. Even a few sentences can be powerful. ✍️",
    lowStreak: "Consistency builds over time. Don't worry about perfection - just show up. 🌱",
    highStreak: "You're building something amazing! Consider adding a new habit? 🎯"
  };
  
  return recommendations[context] || "Every small action matters. What feels right for you today? 💫";
};

// Human touch content replacements
export const humanTouchContent = {
  emptyStates: {
    habits: {
      title: "Your journey starts here 🌱",
      message: "Habits aren't built overnight - they're built one day at a time. Pick something small, something that matters to you, and let's grow together.",
      action: "Create Your First Habit"
    },
    mood: {
      title: "How are you feeling? 💭",
      message: "Your emotions are valid, and tracking them helps you understand yourself better. No judgment, just awareness.",
      action: "Log Your Mood"
    },
    journal: {
      title: "Your thoughts matter ✍️",
      message: "Writing helps us process, reflect, and grow. Start with whatever's on your mind - there's no wrong way to journal.",
      action: "Write Your First Entry"
    }
  },
  feedback: {
    success: {
      habitCreated: "Habit created! 🌟 You've taken the first step.",
      habitCompleted: "Nice work! 🎉 Every completion builds your streak.",
      moodLogged: "Thank you for sharing. 💙 Your feelings are valid.",
      journalSaved: "Your thoughts are safe here. ✍️"
    },
    encouragement: {
      streakMilestone: "🔥 {days} days! You're building something real.",
      habitProgress: "Look at you go! 💪 {completed}/{total} done today.",
      consistency: "Your consistency is inspiring! ✨"
    }
  }
};

// Get time-based background gradient
export const getTimeBasedBackground = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'from-amber-50 via-yellow-50 to-orange-50'; // Morning
  } else if (hour >= 12 && hour < 17) {
    return 'from-blue-50 via-cyan-50 to-teal-50'; // Afternoon
  } else if (hour >= 17 && hour < 21) {
    return 'from-purple-50 via-pink-50 to-rose-50'; // Evening
  } else {
    return 'from-indigo-50 via-blue-50 to-slate-50'; // Night
  }
};

// Get simple greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
};

// Get dynamic welcome message based on user's mood and habits
export const getDynamicWelcomeMessage = (avgMoodScore, habitsCompletedToday) => {
  if (avgMoodScore === undefined || avgMoodScore === null) {
    if (habitsCompletedToday > 0) {
      return `You've completed ${habitsCompletedToday} ${habitsCompletedToday === 1 ? 'habit' : 'habits'} today! Keep up the great work! 💪`;
    }
    return 'Deep analysis of your patterns with actionable recommendations.';
  }

  const messages = [];

  // Mood-based messages
  if (avgMoodScore >= 8) {
    messages.push("Your mood has been excellent! 🌈 Let's see what's been working for you.");
  } else if (avgMoodScore >= 6) {
    messages.push("You're doing well! ✨ Here's what your data tells us.");
  } else if (avgMoodScore >= 4) {
    messages.push("Every day is a chance to grow. 💙 Let's explore your patterns together.");
  } else {
    messages.push("You're tracking your feelings - that's brave. 💙 Let's see what we can learn.");
  }

  // Habit-based messages
  if (habitsCompletedToday > 0) {
    messages.push(`You've completed ${habitsCompletedToday} ${habitsCompletedToday === 1 ? 'habit' : 'habits'} today! 🎯`);
  }

  // Default message
  if (messages.length === 0) {
    return 'Deep analysis of your patterns with actionable recommendations.';
  }

  return messages.join(' ');
};

