import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'card-and-conquer',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Tap to Start',
      description: 'An exciting interactive experience',
      heading: 'Welcome to the Game!',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'card-and-conquer',
  });
};

/**
 * Post a comment to a Reddit post
 * @param postId The ID of the post to comment on (must be in t3_ format)
 * @param text The comment text
 * @returns The created comment
 */
export async function postComment(postId: string, text: string) {
  // Ensure postId has the t3_ prefix
  const fullPostId = postId.startsWith('t3_') ? postId : `t3_${postId}`;

  return await reddit.submitComment({
    id: fullPostId as `t3_${string}`,
    text,
  });
}

/**
 * Create a battle post
 * @param cardName Name of the card starting the battle
 * @param locationName Name of the battle location
 * @param mapType Type of map/terrain
 * @returns The created post
 */
export async function createBattlePost(cardName: string, locationName: string, mapType: string) {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  const title = `⚔️ Battle in ${locationName} led by ${cardName}`;

  return await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'Card And Conquer',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Join Battle',
      description: `A ${mapType} battle at ${locationName}. Join the fight!`,
      heading: `Battle at ${locationName}`,
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'battle',
      locationName,
      mapType,
    },
    subredditName: subredditName,
    title,
  });
}

/**
 * Post a war victory announcement
 * @param faction Winning faction
 * @param playersRewarded Number of players who received bonus
 * @returns The created post
 */
export async function postWarVictoryAnnouncement(
  faction: string,
  playersRewarded: number
): Promise<void> {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  const title = `🎊 ${faction} Faction has conquered the land! 🎊`;
  const description = `${playersRewarded} warriors received victory bonuses. A new war begins!`;

  await reddit.submitCustomPost({
    splash: {
      appDisplayName: 'Card And Conquer',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Join the New War',
      description,
      heading: `${faction} Victory!`,
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'war_victory',
      faction,
      playersRewarded,
    },
    subredditName: subredditName,
    title,
  });
}
