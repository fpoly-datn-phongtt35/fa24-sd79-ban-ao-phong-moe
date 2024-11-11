//package sd79.controller;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.*;
//
//import sd79.dto.response.ResponseData;
//import sd79.service.UserService;
//
//@RestController
//@RequestMapping("api/${api.version}/user")
//@Tag(name = "User Controller", description = "Manage adding, editing, and deleting product user")
//@RequiredArgsConstructor
//public class UserController {
//    private final UserService userService;
//
//    @Operation(
//            summary = "Update Employee",
//            description = "Update employee into database"
//    )
//    @PutMapping("/update-password")
//    public ResponseData<?> updatePassword(@RequestParam("oldPassword") String oldPassword, @RequestParam("newPassword") String newPassword ) {
//        try {
//            // Gọi phương thức updatePassword trong UserService
//            userService.updatePassword(oldPassword, newPassword);
//
//            // Trả về phản hồi thành công
//            return new ResponseData<>(HttpStatus.OK.value(), "Sửa thành công");
//        } catch (Exception e) {
//            // Xử lý ngoại lệ chung
//            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi");
//        }
//    }
//}
