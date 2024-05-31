// 将字符串转换为 Base64 编码（支持中文等非拉丁字符）
function betterBtoa(str: any) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    let binary = ''
    for (let i = 0; i < data.length; i++)
        binary += String.fromCharCode(data[i])

    return btoa(binary)
}

// 将 Base64 编码转换回字符串（支持中文等非拉丁字符）
function betterAtob(base64: any) {
    const binary = atob(base64)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++)
        bytes[i] = binary.charCodeAt(i)

    const decoder = new TextDecoder()
    return decoder.decode(bytes)
}

export { betterBtoa, betterAtob }
