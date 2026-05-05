import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Sticker from './sticker'
import './Pack.css'

const packs = [
  { title: "Fairy Tale Objects", stickers: ["Glass Slipper", "Aladdin's Lamp", "Mermaid Comb", "Sew Good!", "Enchanted Rose", "Red's Hood", "Party Hat", "Golden Harp", "Magic Carpet"] },
  { title: "Fairy Tale Foods", stickers: ["Pumpkin Carriage", "Breadcrumb Trail", "Poison Apple", "Magic Beans", "Mermaid Cake", "Porridge Time", "Wonderland Treat", "Eat Me Cookie", "Drink Me Bottle"] },
  { title: "Mr M & The Beanstalk", stickers: ["Giant Greeting", "One Big Rock", "Money Bath", "Gold Slide", "Harping On", "Massive Appetite", "Golden Egg", "Bye for Now", "Portrait Pals"] },
  { title: "Puss in Boots", stickers: ["Puss in Boots", "Feline Footwear", "Royal Friends", "Feathered Hat", "Riding High", "Gold Coins", "Milking It!", "Scratching Post", "The Hero"] },
  { title: "The Princess & The Pea", stickers: ["Lonely Prince", "Stormy Castle", "Rainy Arrival", "I'm A Princess!", "The Pea", "A Cunning Plan", "Climb Into Bed!", "Unrested", "Royal Feast"] },
  { title: "The Sorcerer's Apprentice", stickers: ["Sleeping Apprentice", "Mighty Sorcerer", "Book of Spells", "What A Mess", "Spellcasting", "Flying Saucers", "Frying Egg", "Pillow Flight", "What Magic?"] },
  { title: "The Frog Prince", stickers: ["Frog", "The Kiss", "A New Man", "Ready to Jump", "Lily Pad", "Taste Test", "Frog Legs", "Royal Search", "Pond Prince"] },
  { title: "Thumbelina", stickers: ["Acorn Cup", "High Table", "Only Way to Fly", "High Roller", "Swimming Pail", "Teahouse", "Sleeping Sock", "Clothes Line", "Tophat Balcony"] },
  { title: "The Little Mermaid", stickers: ["Underwater Friends", "Shipwreck Cafe", "Water Games", "Below Deck", "Wet Hair Look", "Seashell Necklace", "School of Fish", "Prince Ahoy!", "Making A Splash"] },
  { title: "Alice in Wonderland", stickers: ["Alice", "White Rabbit", "Falling", "Caterpillar", "Cheshire Cat", "Tea Party", "Mad Hatter", "Tweedle Twins", "Queen of Hearts"] },
  { title: "Rapunzel", stickers: ["The Tower", "Hair Routine", "Ribbon Basket", "Windmill Wonder", "Bed Head", "Rapunzel's Brush", "Bird Braid!", "High Rollers", "Skipping Rope"] },
  { title: "The Shoemaker Elves", stickers: ["Shoe Shop", "Elves at Work", "Fancy Shoes", "Shoe Size", "Fine Design", "Material Gain", "Sewing Kit", "Boot Bedtime", "The Perfect Fit!"] },
  { title: "Wicked Objects", stickers: ["Magic Mirror", "Cauldron", "Potion", "Spellbook", "Broomstick", "Spinning Wheel", "Poison Comb", "Evil Wand", "Hook's Hook"] },
  { title: "Shadowy Tales", stickers: ["Evil Queen", "Rumpelstiltskin", "Bridge Troll", "Captain Hook", "Wicked Witch", "Sea Witch", "Snow Queen", "Pied Piper", "Jabberwock"] },
  { title: "Fairy Tale Places", stickers: ["Evil Queen's Palace", "Baba Yaga's Hut", "Troll Bridge", "Aladdin's Cave", "Shoe House", "Wishing Well", "Snow Queen's Castle", "Sea Lair", "Enchanted Forest"] },
  { title: "Cinderella", stickers: ["Sweeping Cinders", "Royal Invitation", "Mean Sisters", "Fairy Godmother", "Before the Magic", "Going to the Ball", "Midnight", "Lost Slipper", "Last Pumpkin Home"] },
  { title: "The Gingerbread Man", stickers: ["The Baker", "Fire Escape", "Gingerbread Man", "The Chase", "Craving Cow", "Hungry Horse", "The River", "Fox Ferry", "Feeling Full"] },
  { title: "Pinocchio", stickers: ["Wooden Boy", "Tool Kit", "Geppetto at Work", "Fox and Cat", "Friendly Cricket", "Big Lies", "Donkey", "Blue Fairy", "A Real Boy!"] },
  { title: "Little Red Riding Hood", stickers: ["Off to Grandma's", "Picnic Basket", "Forest Path", "Bad Wolf Hiding", "Grandma's Cottage", "Granny Glamour", "Big Bad Wolf", "Hightail It!", "Brunch in Bed"] },
  { title: "Hansel and Gretel", stickers: ["Lost in the Woods", "Gingerbread House", "Tasty Treats", "A Trifle Naughty", "Sweet Witch!", "Broom Town", "Spring Cleaning", "Home Improvements", "Time to Go Home!"] },
  { title: "Goldilocks", stickers: ["Morning Walk", "Bear's House!", "Hungry for Porridge!", "Papa Bear's Chair", "Splintered Seat", "Feeling Snoozy", "The Bears Return", "Wake Up, Goldilocks", "New Friends"] },
  { title: "Beauty and the Beast", stickers: ["Beauty", "Beast's Mansion", "The Rose", "The Beast", "Enchanted Mirror", "All Alone", "Magic Ring", "Transformed", "Happily Ever After"] },
  { title: "Sleeping Beauty", stickers: ["Ouch!", "Mean Fairy", "Enchanted Sleep", "Kingdom Dreams", "Royal Slumber", "Forest of Thorns", "Knight's Sword", "Cutting Vines", "Ride Awake!"] },
  { title: "The Three Little Pigs", stickers: ["Pig Pals", "Straw House", "Howling Wolf", "Stick House", "Blown Away", "Safe Haven!", "Brick House", "Out of Huff", "Three Happy Pigs"] },
]

export default function Pack({ packIndex, setPackIndex, user }) {
  const pack = packs[packIndex]
  const [counts, setCounts] = useState(pack.stickers.map(() => 0))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCounts()
  }, [packIndex])

  const loadCounts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sticker_counts')
      .select('*')
      .eq('user_id', user.id)
      .eq('pack_index', packIndex)

    if (data) {
      const newCounts = pack.stickers.map((_, i) => {
        const found = data.find(d => d.sticker_index === i)
        return found ? found.count : 0
      })
      setCounts(newCounts)
    }
    setLoading(false)
  }

  const updateCount = async (i, newCount) => {
    setCounts(prev => prev.map((c, idx) => idx === i ? newCount : c))
    await supabase
      .from('sticker_counts')
      .upsert({
        user_id: user.id,
        pack_index: packIndex,
        sticker_index: i,
        count: newCount
      }, { onConflict: 'user_id,pack_index,sticker_index' })
  }

  const increase = (i) => updateCount(i, counts[i] + 1)
  const decrease = (i) => updateCount(i, Math.max(0, counts[i] - 1))

  return (
    <div className="container">
      <div className="packNav">
        <button className="navBtn" onClick={() => setPackIndex(i => Math.max(0, i - 1))} disabled={packIndex === 0}>← Prev</button>
        <select className="dropdown" value={packIndex} onChange={e => setPackIndex(Number(e.target.value))}>
          {packs.map((p, i) => <option key={i} value={i}>{p.title}</option>)}
        </select>
        <button className="navBtn" onClick={() => setPackIndex(i => Math.min(packs.length - 1, i + 1))} disabled={packIndex === packs.length - 1}>Next →</button>
      </div>

      <h1 className="title">{pack.title}</h1>
      {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
        <div className="pack">
          {pack.stickers.map((name, i) => (
            <Sticker key={i} name={name} count={counts[i]} onIncrease={() => increase(i)} onDecrease={() => decrease(i)} />
          ))}
        </div>
      )}
    </div>
  )
}