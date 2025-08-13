const resultEl = document.getElementById('result')
const lengthEl = document.getElementById('length')
const uppercaseEl = document.getElementById('uppercase')
const lowercaseEl = document.getElementById('lowercase')
const numbersEl = document.getElementById('numbers')
const symbolsEl = document.getElementById('symbols')
const excludeSimilarEl = document.getElementById('excludeSimilar')
const generateEl = document.getElementById('generate')
const clipboardEl = document.getElementById('clipboard')
const tooltipEl = document.getElementById('tooltip')
const strengthEl = document.getElementById('strength')

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
}

clipboardEl.addEventListener('click', () => {
  const password = resultEl.innerText
  if (!password) return

  navigator.clipboard.writeText(password)
  tooltipEl.classList.add('show')
  setTimeout(() => tooltipEl.classList.remove('show'), 1000)
})

generateEl.addEventListener('click', () => {
  const length = +lengthEl.value
  const hasLower = lowercaseEl.checked
  const hasUpper = uppercaseEl.checked
  const hasNumber = numbersEl.checked
  const hasSymbol = symbolsEl.checked
  const excludeSimilar = excludeSimilarEl.checked

  const password = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length, excludeSimilar)
  resultEl.innerText = password
  updateStrength(password)
})

function generatePassword(lower, upper, number, symbol, length, excludeSimilar) {
  let generatedPassword = ''
  const typesCount = lower + upper + number + symbol
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0])

  if (typesCount === 0) return ''

  while (generatedPassword.length < length) {
    typesArr.forEach(type => {
      const funcName = Object.keys(type)[0]
      let char = randomFunc[funcName]()
      if (excludeSimilar) {
        while ("O0l1I".includes(char)) {
          char = randomFunc[funcName]()
        }
      }
      generatedPassword += char
    })
  }

  return generatedPassword.slice(0, length)
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}

function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.'
  return symbols[Math.floor(Math.random() * symbols.length)]
}

function updateStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) {
    strengthEl.textContent = "Strength: Weak"
    strengthEl.className = "strength weak"
  } else if (score === 2 || score === 3) {
    strengthEl.textContent = "Strength: Medium"
    strengthEl.className = "strength medium"
  } else {
    strengthEl.textContent = "Strength: Strong"
    strengthEl.className = "strength strong"
  }
}