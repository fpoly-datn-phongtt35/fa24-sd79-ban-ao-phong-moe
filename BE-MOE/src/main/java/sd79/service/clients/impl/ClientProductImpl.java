/*
 * Author: Nong Hoang Vu || JavaTech
 * Facebook:https://facebook.com/NongHoangVu04
 * Github: https://github.com/JavaTech04
 * Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
 */
package sd79.service.clients.impl;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import sd79.dto.requests.clients.bills.BillClientRequest;
import sd79.dto.requests.clients.cart.CartReq;
import sd79.dto.requests.clients.other.FilterForCartReq;
import sd79.dto.response.clients.cart.CartResponse;
import sd79.dto.response.clients.customer.UserInfoRes;
import sd79.dto.response.clients.product.ProductClientResponse;
import sd79.dto.response.clients.product.ProductDetailClientResponse;
import sd79.dto.response.clients.product.ValidProduct;
import sd79.enums.PaymentMethod;
import sd79.enums.ProductStatus;
import sd79.exception.EntityNotFoundException;
import sd79.exception.InvalidDataException;
import sd79.model.*;
import sd79.model.redis_model.Cart;
import sd79.repositories.*;
import sd79.repositories.customQuery.ProductCustomizeQuery;
import sd79.repositories.products.ProductDetailRepository;
import sd79.repositories.products.ProductRepository;
import sd79.service.JwtService;
import sd79.service.clients.ClientProduct;
import sd79.utils.RandomNumberGenerator;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static sd79.enums.TokenType.ACCESS_TOKEN;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientProductImpl implements ClientProduct {

    private final ProductCustomizeQuery productCustomizeQuery;

    private final ProductRepository productRepository;

    private final ProductDetailRepository productDetailRepository;

    private final CartRepository cartRepository;

    private final CustomerRepository customerRepository;

    private final BillRepo billRepository;

    private final BillStatusRepo billStatusRepository;

    private final CouponRepo couponRepo;

    private final JwtService jwtService;

    @Override
    public List<ProductClientResponse> getExploreOurProducts(Integer page) {
        if (page < 1) {
            page = 1;
        }
        return this.productCustomizeQuery.getExploreOurProducts(page);
    }

    @Override
    public Set<ProductClientResponse> getBestSellingProducts() {
        return this.productCustomizeQuery.getBestSellingProducts();
    }

    @Override
    public ProductDetailClientResponse getProductDetail(Long id) {
        Product product = this.productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
        List<ProductClientResponse> relatedItem = this.productRepository.getRelatedItem(product.getId(), product.getCategory().getName(), product.getBrand().getName(), PageRequest.of(0, 5)).stream().map(s -> ProductClientResponse.builder()
                .productId(s.getId())
                .imageUrl(s.getProductImages().getFirst().getImageUrl())
                .name(s.getName())
                .retailPrice(s.getProductDetails().getFirst().getRetailPrice())
                .discountPrice(s.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                .rate(4)
                .rateCount(104)
                .build()
        ).toList();
        return ProductDetailClientResponse.builder()
                .productId(id)
                .imageUrl(product.getProductImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))
                .name(product.getName())
                .retailPrice(product.getProductDetails().getFirst().getRetailPrice())
                .discountPrice(product.getProductDetails().getFirst().getRetailPrice().multiply(BigDecimal.valueOf(1).subtract(BigDecimal.valueOf(0.50))))
                .rate(4)
                .rateCount(102)
                //TODO details
                .sizes(this.productDetailRepository.getSizeProduct(product.getId()))
                .colors(this.productDetailRepository.getColorProduct(product.getId()))
                .quantity(this.productDetailRepository.countByProductId(product.getId()))
                .origin(product.getOrigin())
                .category(product.getCategory().getName())
                .material(product.getMaterial().getName())
                .brand(product.getBrand().getName())
                .description(product.getDescription())
                //TODO related items
                .relatedItem(relatedItem)
                .build();
    }

    @Override
    public List<CartResponse> getCarts(HttpServletRequest request) {
        String authorization = request.getHeader(AUTHORIZATION);
        if (StringUtils.isBlank(authorization)) {
            throw new InvalidDataAccessApiUsageException("Token must be not blank!");
        }
        final String token = authorization.substring("Bearer ".length());
        final String username = this.jwtService.extractUsername(token, ACCESS_TOKEN);
        List<Cart> cart = this.cartRepository.findByUsername(username);
        List<CartResponse> cartResponses = new ArrayList<>();

        cart.forEach(i -> {
            Optional<ProductDetail> productDetail = productDetailRepository.findById(Long.valueOf(i.getId()));
            ValidProduct validProduct = new ValidProduct();
            if (productDetail.isPresent()) {
                ProductDetail prd = productDetail.get();
                boolean status = prd.getStatus() == ProductStatus.ACTIVE && prd.getProduct().getStatus() == ProductStatus.ACTIVE;
                validProduct.setId(prd.getId());
                validProduct.setStatus(status);
                validProduct.setQuantity(prd.getQuantity());
                validProduct.setMessage(String.format("Product id %d is valid", prd.getId()));
            } else {
                validProduct.setId(Long.parseLong(i.getId()));
                validProduct.setStatus(false);
                validProduct.setQuantity(0);
                validProduct.setMessage(String.format("Product id %s is valid", i.getId()));
            }
            cartResponses.add(CartResponse.builder()
                    .id(i.getId())
                    .imageUrl(i.getImageUrl())
                    .name(i.getName())
                    .origin(i.getOrigin())
                    .retailPrice(i.getRetailPrice())
                    .sellPrice(i.getSellPrice())
                    .quantity(i.getQuantity())
                    .validProduct(validProduct)
                    .username(i.getUsername())
                    .build());
        });
        return cartResponses;
    }

    @Override
    public void addToCart(FilterForCartReq req) {
        ProductDetail prd = this.productDetailRepository.findByProductIdAndColorIdAndSizeId(req.getProductId(), req.getColorId(), req.getSizeId()).orElseThrow(() -> new EntityNotFoundException("Sản phẩm này không có sẵn!"));
        Optional<Cart> isAlreadyExists = this.cartRepository.findByIdAndUsername(String.valueOf(prd.getId()), req.getUsername());
        if (isAlreadyExists.isPresent()) {
            Cart updatedCart = isAlreadyExists.get();
            if ((updatedCart.getQuantity() + req.getQuantity()) > prd.getQuantity()) {
                throw new InvalidDataException(String.format("Chỉ còn %d sản phẩm có sẵn!", prd.getQuantity() - updatedCart.getQuantity()));
            }
            updatedCart.setQuantity(updatedCart.getQuantity() + req.getQuantity());
            this.cartRepository.save(updatedCart);
            return;
        }
        if (req.getQuantity() > prd.getQuantity()) {
            throw new InvalidDataException(String.format("Chỉ còn %d sản phẩm có sẵn!", prd.getQuantity()));
        }
        Cart cart = Cart.builder()
                .id(String.valueOf(prd.getId()))
                .imageUrl(prd.getProduct().getProductImages().getFirst().getImageUrl())
                .name(String.format("%s [%s - %s]", prd.getProduct().getName(), prd.getColor().getName(), prd.getSize().getName()))
                .origin(prd.getProduct().getOrigin())
                .retailPrice(prd.getRetailPrice())
                .sellPrice(BigDecimal.valueOf(0))
                .quantity(req.getQuantity())
                .username(req.getUsername())
                .build();
        this.cartRepository.save(cart);
    }

    @Override
    public void updateCart(CartReq req) {
        ProductDetail prd = this.productDetailRepository.findById(req.getProductDetailId()).orElseThrow(() -> new EntityNotFoundException("Product not found"));
        Optional<Cart> isAlreadyExists = this.cartRepository.findByIdAndUsername(String.valueOf(req.getProductDetailId()), req.getUsername());
        if (isAlreadyExists.isPresent()) {
            Cart updatedCart = isAlreadyExists.get();
            updatedCart.setQuantity(req.getQuantity());
            if (req.getQuantity() < 1) {
                throw new InvalidDataException("Số lượng phải lớn hơn 0");
            } else if (req.getQuantity() > prd.getQuantity()) {
                throw new InvalidDataException("Bạn đã thêm tối đa số lượng sản phẩm!");
            }
            this.cartRepository.save(updatedCart);
        }
    }

    @Override
    public void deleteCart(String id, String username) {
        Optional<Cart> isAlreadyExists = this.cartRepository.findByIdAndUsername(id, username);
        isAlreadyExists.ifPresent(this.cartRepository::delete);
    }

    @Override
    public UserInfoRes getUserInfo(long id) {
        Customer customer = this.customerRepository.findByUserId(id).orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        return UserInfoRes.builder()
                .id(customer.getId())
                .fullName(String.format("%s %s", customer.getLastName(), customer.getFirstName()))
                .phone(customer.getPhoneNumber())
                .email(customer.getUser().getEmail())
                .address(String.format("%s, %s, %s, %s", customer.getCustomerAddress().getStreetName(), customer.getCustomerAddress().getWard(), customer.getCustomerAddress().getDistrict(), customer.getCustomerAddress().getCity()))
                .build();
    }

    @Override
    public long saveBill(BillClientRequest.BillCreate req) {
        Customer customer = this.customerRepository.findById(req.getCustomerId()).orElse(null);
        Bill bill = Bill.builder()
                .code(String.format("HD%s", RandomNumberGenerator.generateEightDigitRandomNumber()))
                .bankCode(req.getBankCode())
                .coupon(this.couponRepo.findById(req.getCouponId()).orElse(null))
                .sellerDiscount(req.getSellerDiscount())
                .shipping(req.getShipping())
                .subtotal(req.getSubtotal())
                .total(req.getTotal())
                .paymentMethod(req.getPaymentMethod())
                .message(req.getMessage())
                .customer(customer)
                .billStatus(this.billStatusRepository.findById(1).orElse(null))
                //Bill status
                .paymentTime(req.getPaymentMethod() == PaymentMethod.BANK ? new Date() : null)
                .build();
        assert customer != null;
        bill.setCreatedBy(customer.getUser());
        bill.setUpdatedBy(customer.getUser());
        return this.billRepository.save(bill).getId();
    }

}
