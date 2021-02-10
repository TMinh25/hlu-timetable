import React from "react";

// import components
import {LinkButton} from "../Components";

const NotFoundPage = () => {
	return (
		<div style={styles["not__found-container"]}>
			<div>
				<h1 style={styles.h1}>Trang bạn tìm không tồn tại!</h1>
				<h4 style={styles.h4}>
					Xin lỗi, chúng tôi không tìm thấy trang bạn yêu cầu <br /> Nếu bạn
					thấy thiếu gì đó, hãy thử{" "}
					<a
						href="https://www.facebook.com/sipp.minhh"
						target="_blank"
						style={styles.anchor}
					>
						liên lạc với chúng tôi
					</a>
				</h4>
				<LinkButton className="sign-out" to="../">
					Quay lại trang trước
				</LinkButton>
			</div>
		</div>
	);
};

export default NotFoundPage;

const styles = {
	"not__found-container": {
		display: "flex",
		height: "100%",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	h1: {
		marginBottom: 30,
	},
	h4: {
		marginBottom: 20,
		fontWeight: 400,
	},
	anchor: {
		color: "#cccccc",
		fontSize: "inherit",
		textDecoration: "underline",
	},
};
