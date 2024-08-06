import Capacitor
import Security

@objc(EchoPlugin)
public class EchoPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "EchoPlugin"
    public let jsName = "Echo"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveToKeyChain", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readFromKeyChain", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteFromKeyChain", returnType: CAPPluginReturnPromise)
    ]

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print("echo plugin values", value)
        call.resolve(["value": value])
    }

    @objc func saveToKeyChain(_ call: CAPPluginCall) {
        guard let key = call.getString("key"),
              let value = call.getString("value") else {
            call.reject("Missing key or value")
            return
        }

        let data = Data(value.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessGroup as String: "group.io.sharely.app" // Access group
        ]

        // Delete any existing item with the same key
        SecItemDelete(query as CFDictionary)

        // Add the new item to the keychain
        let status = SecItemAdd(query as CFDictionary, nil)

        if status == errSecSuccess {
            call.resolve(["key": key, "value": value])
        } else {
            let errorMessage = SecCopyErrorMessageString(status, nil) as String? ?? "Unknown error"
            call.reject("Failed to save data to keychain", errorMessage)
        }
    }

    @objc func readFromKeyChain(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Missing key")
            return
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecAttrAccessGroup as String: "group.io.sharely.app" // Access group
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecSuccess, let data = item as? Data, let value = String(data: data, encoding: .utf8) {
            call.resolve(["key": key, "value": value])
        } else {
            call.resolve(["key": key, "value": ""])
        }
    }

    @objc func deleteFromKeyChain(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Missing key")
            return
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrAccessGroup as String: "group.io.sharely.app" // Access group
        ]

        let status = SecItemDelete(query as CFDictionary)

        if status == errSecSuccess {
            call.resolve(["key": key])
        } else {
            call.reject("Failed to delete data from keychain")
        }
    }
}
