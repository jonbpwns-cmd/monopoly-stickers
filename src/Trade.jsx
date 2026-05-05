import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './Trade.css'

const packs = [
  "Fairy Tale Objects", "Fairy Tale Foods", "Mr M & The Beanstalk", "Puss in Boots",
  "The Princess & The Pea", "The Sorcerer's Apprentice", "The Frog Prince", "Thumbelina",
  "The Little Mermaid", "Alice in Wonderland", "Rapunzel", "The Shoemaker Elves",
  "Wicked Objects", "Shadowy Tales", "Fairy Tale Places", "Cinderella",
  "The Gingerbread Man", "Pinocchio", "Little Red Riding Hood", "Hansel and Gretel",
  "Goldilocks", "Beauty and the Beast", "Sleeping Beauty", "The Three Little Pigs"
]

const stickers = [
  ["Glass Slipper", "Aladdin's Lamp", "Mermaid Comb", "Sew Good!", "Enchanted Rose", "Red's Hood", "Party Hat", "Golden Harp", "Magic Carpet"],
  ["Pumpkin Carriage", "Breadcrumb Trail", "Poison Apple", "Magic Beans", "Mermaid Cake", "Porridge Time", "Wonderland Treat", "Eat Me Cookie", "Drink Me Bottle"],
  ["Giant Greeting", "One Big Rock", "Money Bath", "Gold Slide", "Harping On", "Massive Appetite", "Golden Egg", "Bye for Now", "Portrait Pals"],
  ["Puss in Boots", "Feline Footwear", "Royal Friends", "Feathered Hat", "Riding High", "Gold Coins", "Milking It!", "Scratching Post", "The Hero"],
  ["Lonely Prince", "Stormy Castle", "Rainy Arrival", "I'm A Princess!", "The Pea", "A Cunning Plan", "Climb Into Bed!", "Unrested", "Royal Feast"],
  ["Sleeping Apprentice", "Mighty Sorcerer", "Book of Spells", "What A Mess", "Spellcasting", "Flying Saucers", "Frying Egg", "Pillow Flight", "What Magic?"],
  ["Frog", "The Kiss", "A New Man", "Ready to Jump", "Lily Pad", "Taste Test", "Frog Legs", "Royal Search", "Pond Prince"],
  ["Acorn Cup", "High Table", "Only Way to Fly", "High Roller", "Swimming Pail", "Teahouse", "Sleeping Sock", "Clothes Line", "Tophat Balcony"],
  ["Underwater Friends", "Shipwreck Cafe", "Water Games", "Below Deck", "Wet Hair Look", "Seashell Necklace", "School of Fish", "Prince Ahoy!", "Making A Splash"],
  ["Alice", "White Rabbit", "Falling", "Caterpillar", "Cheshire Cat", "Tea Party", "Mad Hatter", "Tweedle Twins", "Queen of Hearts"],
  ["The Tower", "Hair Routine", "Ribbon Basket", "Windmill Wonder", "Bed Head", "Rapunzel's Brush", "Bird Braid!", "High Rollers", "Skipping Rope"],
  ["Shoe Shop", "Elves at Work", "Fancy Shoes", "Shoe Size", "Fine Design", "Material Gain", "Sewing Kit", "Boot Bedtime", "The Perfect Fit!"],
  ["Magic Mirror", "Cauldron", "Potion", "Spellbook", "Broomstick", "Spinning Wheel", "Poison Comb", "Evil Wand", "Hook's Hook"],
  ["Evil Queen", "Rumpelstiltskin", "Bridge Troll", "Captain Hook", "Wicked Witch", "Sea Witch", "Snow Queen", "Pied Piper", "Jabberwock"],
  ["Evil Queen's Palace", "Baba Yaga's Hut", "Troll Bridge", "Aladdin's Cave", "Shoe House", "Wishing Well", "Snow Queen's Castle", "Sea Lair", "Enchanted Forest"],
  ["Sweeping Cinders", "Royal Invitation", "Mean Sisters", "Fairy Godmother", "Before the Magic", "Going to the Ball", "Midnight", "Lost Slipper", "Last Pumpkin Home"],
  ["The Baker", "Fire Escape", "Gingerbread Man", "The Chase", "Craving Cow", "Hungry Horse", "The River", "Fox Ferry", "Feeling Full"],
  ["Wooden Boy", "Tool Kit", "Geppetto at Work", "Fox and Cat", "Friendly Cricket", "Big Lies", "Donkey", "Blue Fairy", "A Real Boy!"],
  ["Off to Grandma's", "Picnic Basket", "Forest Path", "Bad Wolf Hiding", "Grandma's Cottage", "Granny Glamour", "Big Bad Wolf", "Hightail It!", "Brunch in Bed"],
  ["Lost in the Woods", "Gingerbread House", "Tasty Treats", "A Trifle Naughty", "Sweet Witch!", "Broom Town", "Spring Cleaning", "Home Improvements", "Time to Go Home!"],
  ["Morning Walk", "Bear's House!", "Hungry for Porridge!", "Papa Bear's Chair", "Splintered Seat", "Feeling Snoozy", "The Bears Return", "Wake Up, Goldilocks", "New Friends"],
  ["Beauty", "Beast's Mansion", "The Rose", "The Beast", "Enchanted Mirror", "All Alone", "Magic Ring", "Transformed", "Happily Ever After"],
  ["Ouch!", "Mean Fairy", "Enchanted Sleep", "Kingdom Dreams", "Royal Slumber", "Forest of Thorns", "Knight's Sword", "Cutting Vines", "Ride Awake!"],
  ["Pig Pals", "Straw House", "Howling Wolf", "Stick House", "Blown Away", "Safe Haven!", "Brick House", "Out of Huff", "Three Happy Pigs"],
]

export default function Trade({ user }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)

    // Get all users except me
    const { data: allUsers } = await supabase
      .from('users')
      .select('*')
      .neq('id', user.id)

    if (!allUsers || allUsers.length === 0) {
      setMatches([])
      setLoading(false)
      return
    }

    // Get my spares (count > 1)
    const { data: myData } = await supabase
      .from('sticker_counts')
      .select('*')
      .eq('user_id', user.id)
      .gt('count', 1)

    if (!myData || myData.length === 0) {
      setMatches([])
      setLoading(false)
      return
    }

    // Get all other users' sticker counts
    const { data: othersData } = await supabase
      .from('sticker_counts')
      .select('*')
      .in('user_id', allUsers.map(u => u.id))

    const results = []

    for (const spare of myData) {
      for (const otherUser of allUsers) {
        // Find if other user has this sticker
        const otherRecord = othersData?.find(
          o => o.user_id === otherUser.id &&
               o.pack_index === spare.pack_index &&
               o.sticker_index === spare.sticker_index
        )

        // They need it if they have no record OR count is 0
        const theyNeedIt = !otherRecord || otherRecord.count === 0

        if (theyNeedIt) {
          results.push({
            packName: packs[spare.pack_index],
            stickerName: stickers[spare.pack_index][spare.sticker_index],
            needsUser: otherUser.username,
            myCount: spare.count,
          })
        }
      }
    }

    setMatches(results)
    setLoading(false)
  }

  return (
    <div className="tradePage">
      <h1 className="tradeTitle">🔄 Trade Matches</h1>
      <p className="tradeSub">Stickers you have spares of that other players need</p>

      {loading && <p className="tradeLoading">Loading...</p>}

      {!loading && matches.length === 0 && (
        <p className="tradeEmpty">No matches yet — make sure you have spares (count above 1) and others have logged their collections!</p>
      )}

      {!loading && matches.length > 0 && (
        <div className="tradeList">
          {matches.map((m, i) => (
            <div key={i} className="tradeRow">
              <div className="tradePack">{m.packName}</div>
              <div className="tradeSticker">{m.stickerName}</div>
              <div className="tradeInfo">
                <span className="tradeCount">You have: {m.myCount}</span>
                <span className="tradeNeeds">Needed by: <strong>{m.needsUser}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}